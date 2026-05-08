# Sistema de Auditoría

Sistema de registro de actividades configurable desde la interfaz, diseñado para funcionar automáticamente con cualquier sección nueva.

---

## Arquitectura

```
Acción del usuario → AutoAudit Middleware → AuditConfig.findOrCreate → AuditLog (DB)
                                                    ↑
                                            Auto-registro on-demand
                                            + Configurable desde UI
```

- Cada petición pasa por el middleware `autoAudit()`.
- El middleware determina `resource` + `action` automáticamente desde la URL.
- **Auto-registro:** Si no existe una entrada en `AuditConfig` para ese `resource + action`, la crea automáticamente con `enabled: true`.
- Si la configuración existe y está habilitada, guarda un registro en `AuditLog`.

---

## Modelos

### AuditLog

Almacena cada evento auditado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER PK | |
| `userId` | INTEGER? | ID del usuario que ejecutó la acción |
| `userEmail` | STRING? | Email del usuario (respaldo) |
| `action` | STRING | `create`, `read`, `update`, `delete`, `login`, `logout` |
| `resource` | STRING | `users`, `roles`, `permissions`, `auth`, etc. |
| `resourceId` | STRING? | ID del recurso afectado |
| `description` | STRING? | Texto legible para el usuario final |
| `oldValues` | JSON? | Estado anterior del recurso (update/delete) |
| `newValues` | JSON? | Nuevo estado del recurso (create/update) |
| `ip` | STRING? | Dirección IP del cliente |
| `userAgent` | STRING? | User-Agent del navegador |
| `createdAt` | DATE | Fecha del evento |

### AuditConfig

Controla desde la UI qué recursos/acciones se auditan.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER PK | |
| `resource` | STRING | `users`, `roles`, `permissions`, `*` (todos) |
| `action` | STRING | `create`, `read`, `update`, `delete`, `*` (todas) |
| `enabled` | BOOLEAN | Si está activo o no |
| `createdAt` | DATE | |
| `updatedAt` | DATE | |

**Regla:** Si no existe una configuración para un resource+action, el middleware la crea automáticamente con `enabled: true` en la primera petición que la use.

---

## Middleware

### `autoAudit()`

Se aplica a nivel de router y detecta automáticamente `resource` y `action`.

```js
import { autoAudit } from '../middleware/auditMiddleware.js';
router.use(autoAudit());
```

**Detección automática:**

| URL | Método | Resource | Action |
|-----|--------|----------|--------|
| `/api/users` | GET | `users` | `read` |
| `/api/users/create-user` | POST | `users` | `create` |
| `/api/users/update-user/1` | PUT | `users` | `update` |
| `/api/users/delete-user/1` | DELETE | `users` | `delete` |
| `/api/roles/:id/permissions` | PUT | `roles` | `update` |
| `/api/audit-logs` | GET | `audit-logs` | `read` |

**Reglas de detección:**
- `resource` = primer segmento del path después de `/api/`
- `action` se determina por método HTTP + último segmento del path:
  - `POST` + último segmento es `login`, `login-*` o `login/*` → `login`
  - `POST` + último segmento es `logout`, `logout-*` o `logout/*` → `logout`
  - `POST` + último segmento es `create`, `create-*` o `create/*` → `create`
  - `POST` (otro) → `create`
  - `GET` → `read`
  - `PUT` → `update`
  - `DELETE` → `delete`
- `resourceId` = último segmento numérico del path (ej: `/api/roles/5/permissions/12` → `12`)

### `audit(resource, action)`

Para uso explícito cuando la detección automática no es suficiente.

```js
import { audit } from '../middleware/auditMiddleware.js';
router.delete('/custom-action', [verifyToken, audit('inventario', 'delete')], handler);
```

### Flujo interno

1. Determina `resource` + `action` + `resourceId` (auto o explícito).
2. Ejecuta `AuditConfig.findOrCreate({ where: { resource, action }, defaults: { enabled: true } })`.
3. **Si se creó un nuevo registro** (`created === true`), omite el log de esta petición (solo fue el auto-registro).
4. Si `enabled === false`, omite el registro.
5. Escucha `res.on('finish')` para capturar después de que la respuesta se haya enviado.
6. Captura: userId, userEmail, IP, User-Agent.
7. Para `update`/`delete`: resuelve el modelo dinámicamente (`resolveModel`) y busca el valor anterior del recurso.
8. Para `create`/`update`: captura el body de la respuesta.
9. Genera una descripción legible.
10. Guarda el `AuditLog` en la base de datos con **reintento automático** (2 intentos con backoff de 1s y 2s) si falla.

---

## API

### Endpoints de auditoría

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| `GET` | `/api/audit-logs` | `audit-logs:read` | Lista paginada con filtros |
| `GET` | `/api/audit-logs/:id` | `audit-logs:read` | Detalle de un registro |
| `DELETE` | `/api/audit-logs/cleanup` | `audit-logs:delete` | Limpiar logs anteriores a N días |

**Parámetros de `GET /api/audit-logs`:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page` | number | Página actual (default: 1) |
| `limit` | number | Items por página (default: 50, max: 100) |
| `resource` | string | Filtrar por recurso |
| `action` | string | Filtrar por acción |
| `userId` | number | Filtrar por usuario |
| `from` | string | Fecha inicial (ISO) |
| `to` | string | Fecha final (ISO) |
| `search` | string | Búsqueda en descripción |

**Respuesta:**
```json
{
  "data": [ ... AuditLog[] ],
  "total": 1500,
  "page": 1,
  "totalPages": 30
}
```

### Endpoints de configuración

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| `GET` | `/api/audit-config` | `audit-config:read` | Listar configuraciones |
| `PUT` | `/api/audit-config` | `audit-config:update` | Actualizar configuraciones |

**Body de `PUT /api/audit-config`:**
```json
{
  "configs": [
    { "id": 1, "enabled": false },
    { "id": 2, "enabled": true }
  ]
}
```

---

## Frontend

### Páginas

#### Auditoría (`/audit-logs`)

Tabla con:
- Columnas: Fecha, Usuario, Acción, Recurso, Detalle
- Filtros: selector de fechas, dropdown de resource, dropdown de action, campo de búsqueda
- Paginación
- Expandir fila para ver `oldValues` / `newValues` en formato JSON
- Botón "Limpiar logs" para admin

#### Configuración de Auditoría (`/audit-config`)

Tabla con:
- Columnas: Recurso, Acción, Habilitado (toggle switch)
- Toggle on/off que persiste al servidor
- Agrupado por recurso

### Servicio

```typescript
// app/src/services/auditService.ts
class AuditService {
  async getLogs(params): Promise<PaginatedResponse<AuditLogResponse>>
  async getLogById(id): Promise<AuditLogResponse>
  async cleanupLogs(days): Promise<{ message }>
  async getConfig(): Promise<AuditConfigResponse[]>
  async updateConfig(configs): Promise<AuditConfigResponse[]>
}
```

### Types

```typescript
AuditLogResponse {
  id: string; userId: string | null; userEmail: string | null;
  action: string; resource: string; resourceId: string | null;
  description: string | null; oldValues: any; newValues: any;
  ip: string | null; userAgent: string | null; createdAt: string;
}

AuditConfigResponse {
  id: string; resource: string; action: string; enabled: boolean;
}
```

---

## Cómo agregar auditoría a una sección nueva

**El sistema es 100% automático.** Solo necesitas un paso:

### Paso 1: Agregar el middleware a las rutas
En el archivo de rutas de tu nueva sección, agrega:
```js
import { autoAudit } from '../middleware/auditMiddleware.js';
router.use(autoAudit());
```

**Esto es todo.** El middleware hará automáticamente:
- Detectará `resource` y `action` desde la URL
- Creará las entradas en `AuditConfig` la primera vez que se use cada combinación (auto-registro on-demand)
- Aparecerá automáticamente en la UI de **Config. Auditoría** sin pasos adicionales
- Comenzará a registrar eventos en **Auditoría**

Ejemplo con una sección de **inventario**:
```js
// server/routes/inventory.routes.js
import { autoAudit } from '../middleware/auditMiddleware.js';

router.get('/inventario', [verifyToken, hasPermission('inventario', 'read')], handler);
router.post('/inventario/create', [verifyToken, hasPermission('inventario', 'create')], handler);
router.put('/inventario/update/:id', [verifyToken, hasPermission('inventario', 'update')], handler);
router.delete('/inventario/delete/:id', [verifyToken, hasPermission('inventario', 'delete')], handler);

router.use(autoAudit()); // ← Solo esta línea

// La primera vez que alguien haga GET /api/inventario:
// → Se crea AuditConfig { resource: 'inventario', action: 'read', enabled: true }
// → Aparece en Config. Auditoría sin hacer nada más
```

### Paso 2 (opcional): Configurar qué se audita
Desde la UI en **Config. Auditoría** puedes habilitar/deshabilitar la auditoría para cualquier recurso y acción. Los nuevos recursos aparecen automáticamente aquí después de su primer uso.

### Paso 3 (personalización): Auditoría explícita
Si la detección automática no es suficiente para un caso especial, usa `audit('resource', 'action)` de forma explícita:
```js
import { audit } from '../middleware/auditMiddleware.js';
router.delete('/custom-action', [verifyToken, audit('inventario', 'delete')], handler);
```

---

## Seeders iniciales

Al ejecutar las migraciones y seeders, se crean configuraciones para los recursos existentes (users, roles, permissions, auth, audit-logs, audit-config) con todas las acciones habilitadas.

**Nota:** Para recursos nuevos no es necesario crear seeders. El sistema usa **auto-registro on-demand**: la primera vez que se ejecuta una acción sobre un recurso nuevo, se crea automáticamente su entrada en `AuditConfig` con `enabled: true`.

---

## Mejoras del sistema

### `resolveModel` — oldValues dinámico para cualquier recurso

El middleware resuelve automáticamente el modelo de Sequelize para capturar `oldValues` en acciones `update`/`delete`:

1. Primero busca en overrides explícitos (`users` → `db.Users`, `roles` → `db.Role`, `permissions` → `db.Permission`)
2. Si no encuentra, intenta capitalizar el nombre del recurso (`inventario` → `db.Inventario`)
3. Si el modelo existe, captura el estado anterior; si no, `oldValues` queda como `null`

**Convención:** Si tu modelo se llama `Inventario`, tu ruta debe usar el resource `inventario` para que `resolveModel` lo encuentre automáticamente.

### Reintento automático

Si la base de datos falla temporalmente al guardar un log de auditoría, el sistema reintenta automáticamente 2 veces con backoff exponencial (1s, 2s) antes de descartar el log.

### Índice único en modelo

El modelo `AuditConfig` declara un índice único en `(resource, action)` para garantizar que `findOrCreate` funcione correctamente incluso si se usa `sequelize.sync({ force: true })`.
