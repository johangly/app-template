# Tasklist - elTigreMiCiudad

## Contexto del proyecto

Aplicación con backend Express/Sequelize/MySQL y frontend React/Vite/TypeScript.
Dos repositorios independientes en `/server` y `/app`.
Autenticación JWT, RBAC dinámico con permisos, menú dinámico basado en permisos.

---

## Estado actual (todo implementado)

### Backend (`/server`)
- Auth: JWT, login/logout, verifyToken, isAdmin
- Permisos: modelo Permission, modelo RolePermission, middleware hasPermission
- Privilegios: middleware preventPrivilegeEscalation, canManageRole
- Auditoría: modelo AuditLog, modelo AuditConfig, middleware autoAudit/audit
- Rutas: users, roles, permissions, audit-logs, audit-config
- Seeders: roles (Admin/User/Guest), users, permissions, admin-permissions, audit-config

### Frontend (`/app`)
- Páginas: Home, Users, Roles, Permissions, AuditLogs, AuditConfig
- Componentes: Modal, ConfirmDialog, UserForm, RoleForm, PermissionForm, RolePermissionsForm, RequirePermission
- Hooks: useUser, useRole, usePermission, useMenuItems
- Menú dinámico: se genera desde useMenuItems según permisos del usuario
- shadcn/ui: Select component instalado y en uso
- Estilos: Tailwind v4, framer-motion, lucide-react, dark mode

---

## Pendientes / próximos pasos

### 1. Bloqueo de cuenta por intentos fallidos
- Agregar `loginAttempts` y `lockUntil` al modelo Users
- Middleware en login que incremente intentos y bloquee
- Dashboard muestra usuarios bloqueados
- Seeders y migración

### 2. Recuperación de contraseña
- `POST /auth/forgot-password` → envía email con token
- `POST /auth/reset-password` → cambia contraseña
- Seed de configuración SMTP

### 3. Paginación genérica + DataTable reutilizable
- Helper `paginate(model, query, page, limit, filters)` en backend
- Hook `useTable` en frontend
- Componente `DataTable` con sort, paginación, búsqueda

### 4. Componentes UI reutilizables
- `Skeleton` para loadings
- `EmptyState` estandarizado (ya se repite en varias páginas)
- `FormField` con label + input + error unificado

### 5. Exportación de datos (CSV)
- Helper backend `exportToCSV(query, filename)`
- Botón en tablas "Exportar"

### 6. Subida de archivos / Avatar
- Middleware multer
- Componente `FileUpload` con preview
- Endpoint `POST /upload`

### 7. Docker
- `docker-compose.yml` con MySQL + app

### 8. Mejoras menores identificadas
- Validación con Zod en bodies de rutas (ya está instalado zod)
- Script `npm run db:seed:all` para ejecutar seeders en orden
- Postman collection

---

## Convenciones del proyecto

**Commits:**
- Formato: `feat:|fix:|docs: mensaje descriptivo`
- Commit por proyecto (server y app por separado)

**Migraciones + Seeders:**
- Migraciones en `server/migrations/` (.cjs)
- Seeders en `server/seeders/` (.cjs)
- Ejecutar: `npx sequelize-cli db:migrate` / `npx sequelize-cli db:seed --seed nombre`

**Para agregar nueva sección:**
1. Crear permisos desde UI (`/permissions`)
2. Asignar a roles desde UI de roles
3. Crear rutas backend con `hasPermission('resource', 'action')`
4. Agregar `router.use(autoAudit())` para auditoría automática
5. Crear página frontend
6. Agregar 1 línea en `useMenuItems.ts` con icono + ruta
7. Agregar ruta en `App.tsx`
8. Ver `GUIA_AGREGAR_SECCION.md` para más detalle

---

## Archivos de documentación creados

| Archivo | Contenido |
|---------|-----------|
| `/app/styles.md` | Guía de estilos Tailwind |
| `/app/GUIA_AGREGAR_SECCION.md` | Cómo agregar nuevas secciones |
| `/app/DOC_AUDITORIA.md` | Documentación del sistema de auditoría |
| `/app/tasklist-opencode.md` | Este archivo |


## pendiente:

por cierto ya que estás agregando más cosas de SID y cosas relacionadas a eso ten en cuenta que todo esto debe estar por defecto cuando se inicia el sistema inicialmente o sea tienes que hacer que haya en la documentación la guía para hacer esto nuevo que estás agregando creo que en el README.md tienes una guía de instalación donde ejecutas los SID de roles y de usuarios bueno ahí también tienes que agregar los pasos para que esto nuevo de auditoría también funcione

revisar si se arreglo:

Bueno, estoy haciendo las revisiones y en el crear usuario, por defecto cuando vas a crear un usuario, primero no se ve nada, no se ve nada en el role, el role por defecto no tiene nada seleccionado, debería tener algo seleccionado, aunque no se ve y si le doy a user, por ejemplo, o a guest, no aparece nada tampoco en el input que está acá. Lo demás está bien. En cuanto a por menos permisos, veo que en el action de nuevo permiso, sí aparece el texto y hay algo seleccionado ya, sin embargo, el ancho, la altura en el eje Y, la altura del input select no se parece a la de los demás, ajustala para que se parezca a los demás. Si quieres edita y personaliza el componente de Shazam para mejorar esto, las dos cosas que te menciono, tanto en usuarios como en nuevo permiso.