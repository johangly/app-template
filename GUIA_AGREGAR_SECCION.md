# Guía: Agregar una nueva sección con permisos

Esta guía explica cómo agregar una nueva sección (ej: **Inventario**) con su propio sistema de permisos, sin tener que modificar código existente más allá de la página y las rutas.

---

## Arquitectura del sistema de permisos

```
Usuario → tiene un Rol → el Rol tiene muchos Permisos
                           Cada permiso = resource + action
                           Ej: { resource: "inventario", action: "create" }
```

Los permisos son **dinámicos**: se crean desde la UI (`/permissions`), se asignan a roles desde la UI de roles, y se validan con `hasPermission(resource, action)`.

---

## Paso a paso para agregar "Inventario"

### 1. Crear los permisos desde la UI

1. Ve a `Administración → Permisos`
2. Haz clic en **"Nuevo Permiso"**
3. Crea los 4 permisos estándar:

| Nombre | Resource | Action | Descripción |
|--------|----------|--------|-------------|
| inventario:create | inventario | create | Crear items en inventario |
| inventario:read | inventario | read | Ver inventario |
| inventario:update | inventario | update | Editar items |
| inventario:delete | inventario | delete | Eliminar items |

### 2. Asignar permisos a los roles

1. Ve a `Administración → Roles`
2. Haz clic en el número de permisos del rol que quieras modificar
3. Marca los permisos de `inventario` que correspondan

### 3. Crear las rutas en el backend (server/)

```javascript
// server/routes/inventario.routes.js
import db from '../database/index.js';
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { hasPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.get('/', [verifyToken, hasPermission('inventario', 'read')], async (req, res) => {
    // ... lógica
});

router.post('/create', [verifyToken, hasPermission('inventario', 'create')], async (req, res) => {
    // ... lógica
});

router.put('/update/:id', [verifyToken, hasPermission('inventario', 'update')], async (req, res) => {
    // ... lógica
});

router.delete('/delete/:id', [verifyToken, hasPermission('inventario', 'delete')], async (req, res) => {
    // ... lógica
});

export default router;
```

```javascript
// server/index.js - agregar:
import inventarioRoutes from "./routes/inventario.routes.js";
app.use(`${API_PREFIX}/inventario`, inventarioRoutes);
```

> **Nota:** No necesitas modificar nada más en el backend. El middleware `hasPermission` ya valida contra la base de datos dinámicamente.

### 4. Crear la página en el frontend (app/)

```tsx
// app/src/pages/InventarioPage.tsx
import { usePermission } from '../hooks/usePermission';

export default function InventarioPage() {
    const puedeCrear = usePermission('inventario', 'create');

    return (
        <div>
            <h1>Inventario</h1>
            {puedeCrear && <button>Agregar Item</button>}
        </div>
    );
}
```

### 5. Agregar la ruta en App.tsx

```tsx
// app/src/App.tsx
import InventarioPage from "./pages/InventarioPage";

<Route path="/inventario" element={<InventarioPage />} />
```

### 6. Registrar el recurso en el menú dinámico

El menú se construye automáticamente desde `useMenuItems.ts` según los permisos del usuario. Solo necesitas agregar la configuración del recurso:

```typescript
// app/src/hooks/useMenuItems.ts
import { Package } from 'lucide-react'; // o cualquier icono de lucide-react

const resourceConfig: Record<string, { label: string; icon: LucideIcon; path: string; parent?: string }> = {
    // ... existentes
    inventario: { label: 'Inventario', icon: Package, path: '/inventario', parent: 'admin' },
};
```

Eso es todo. Cuando un usuario tenga el permiso `inventario:read`, la opción **Inventario** aparecerá automáticamente en su menú lateral.

---

## Resumen: lo que tocas vs lo que ya funciona solo

| Qué hacer | Archivos a tocar |
|-----------|-----------------|
| Crear permisos | ✅ Desde la UI (`/permissions`) |
| Asignar a roles | ✅ Desde la UI de roles |
| Rutas backend | `server/routes/inventario.routes.js` + `server/index.js` |
| Página frontend | `app/src/pages/InventarioPage.tsx` |
| Ruta frontend | `app/src/App.tsx` |
| Ícono en menú | `app/src/hooks/useMenuItems.ts` (1 línea) |

**Lo que NO tocas:**
- ❌ Validación de permisos → ya existe (`hasPermission`)
- ❌ Middleware de auth → ya existe (`verifyToken`)
- ❌ Menú dinámico → se genera solo según permisos del usuario
- ❌ Segregación por permisos → `usePermission()` ya filtra UI
- ❌ Protección de rutas en frontend → `RequirePermission` ya existe

---

## API de permisos disponible

### Backend
| Middleware | Uso |
|-----------|-----|
| `verifyToken` | Verifica JWT y carga permisos del usuario |
| `hasPermission(resource, action)` | Valida que el usuario tenga ese permiso |
| `hasAnyPermission([{resource, action}, ...])` | Valida que tenga al menos uno |

### Frontend
| Hook / Componente | Uso |
|-------------------|-----|
| `usePermission(resource, action)` | Devuelve `boolean` |
| `useHasAnyPermission([...])` | Devuelve `boolean` |
| `<RequirePermission resource="x" action="y">` | Render condicional |
| `useMenuItems()` | Construye el menú lateral dinámicamente |

---

## Buenas prácticas de seguridad

1. **Siempre validar en backend** - El frontend es solo UX, la seguridad real está en `hasPermission`
2. **Nunca asignar permisos que no tienes** - El backend lo valida con `preventPrivilegeEscalation`
3. **Usar `read` para ver, `create` para crear, etc.** - Es el estándar REST
4. **Los recursos en minúscula y plural** - `inventario`, `usuarios`, `roles`
5. **Las acciones en inglés** - `create`, `read`, `update`, `delete` (consistencia con el código)
