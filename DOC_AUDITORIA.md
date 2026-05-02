# Sistema de Auditoría

Sistema de registro de actividades configurable desde la interfaz, diseñado para funcionar automáticamente con cualquier sección nueva.

---

## Arquitectura

```
Acción del usuario → AutoAudit Middleware → AuditConfig (¿habilitado?) → AuditLog (DB)
                                                    ↑
                                           Configurable desde UI
```

- Cada petición pasa por el middleware `autoAudit()`.
- El middleware determina `resource` + `action` automáticamente desde la URL.
- Consulta `AuditConfig` para saber si debe registrar el evento.
- Si está habilitado, guarda un registro en `AuditLog`.

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

**Regla:** Si no existe una configuración para un resource+action, se audita por defecto (`enabled: true`).

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
- `action` se determina por método HTTP + path:
  - `POST` + path contiene `login` → `login`
  - `POST` + path contiene `logout` → `logout`
  - `POST` + path contiene `create` → `create`
  - `GET` → `read`
  - `PUT` → `update`
  - `DELETE` → `delete`

### `audit(resource, action)`

Para uso explícito cuando la detección automática no es suficiente.

```js
import { audit } from '../middleware/auditMiddleware.js';
router.delete('/custom-action', [verifyToken, audit('inventario', 'delete')], handler);
```

### Flujo interno

1. Determina `resource` + `action` (auto o explícito).
2. Consulta `AuditConfig` por `{ resource, action }`. Si no existe, por defecto se audita.
3. Si `enabled === false`, omite el registro.
4. Escucha `res.on('finish')` para capturar después de que la respuesta se haya enviado.
5. Captura: userId, userEmail, IP, User-Agent.
6. Para `update`/`delete`: busca el valor anterior del recurso.
7. Para `create`/`update`: captura el body de la respuesta.
8. Genera una descripción legible.
9. Guarda el `AuditLog` en la base de datos.

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

Cuando crees una nueva sección (ej: **inventario**):

### Paso 1 (obligatorio)
En el archivo de rutas, agrega:
```js
import { autoAudit } from '../middleware/auditMiddleware.js';
router.use(autoAudit());
```

El middleware detectará automáticamente:
- `POST /api/inventario/create` → resource: `inventario`, action: `create`
- `GET /api/inventario` → resource: `inventario`, action: `read`

### Paso 2 (opcional)
Si quieres desactivar la auditoría para inventario desde el principio, ve a `Config. Auditoría` y deshabilitas los permisos de `inventario`.

### Paso 3 (personalización)
Si necesitas capturar lógica específica, usa `audit('inventario', 'crear')` de forma explícita.

---

## Seeders iniciales

Al ejecutar las migraciones y seeders, se crean configuraciones para todos los recursos existentes (users, roles, permissions, auth, audit-logs, audit-config) con todas las acciones habilitadas.
