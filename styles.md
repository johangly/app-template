# Guía de Estilos - elTigreMiCiudad

Guía de estilos para estandarizar el CSS con Tailwind en toda la aplicación. El estándar visual está basado en la página de **Usuarios** (`UsersPage.tsx`).

---

## 1. Paleta de Colores

### Colores principales
| Uso | Clase Tailwind |
|-----|---------------|
| Primario (botones, acentos) | `blue-600` / hover: `blue-700` |
| Texto principal | `gray-900` (light) / `white` (dark) |
| Texto secundario | `gray-600` (light) / `gray-400` (dark) |
| Texto terciario | `gray-500` (light) / `gray-400` (dark) |

### Fondos
| Uso | Clase Tailwind |
|-----|---------------|
| Fondo de página | `bg-gray-50` (light) / `bg-gray-900` (dark) |
| Cards / Contenedores | `bg-white` (light) / `bg-gray-800` (dark) |
| Headers de tablas | `bg-gray-50` (light) / `bg-gray-900` (dark) |
| Inputs | `bg-gray-50` (light) / `bg-gray-800` (dark) |
| Hover en filas de tabla | `hover:bg-gray-50` (light) / `hover:bg-gray-900/50` (dark) |

### Bordes
| Uso | Clase Tailwind |
|-----|---------------|
| Cards | `border-gray-200` (light) / `border-gray-700` (dark) |
| Inputs | `border-gray-300` (light) / `border-gray-700` (dark) |
| Separadores de tabla | `divide-gray-200` (light) / `divide-gray-700` (dark) |

### Estados (badges)
| Estado | Clase Tailwind |
|--------|---------------|
| Activo / Éxito | `bg-green-100 text-green-800` + `dark:bg-green-900/30 dark:text-green-400` |
| Inactivo / Error | `bg-red-100 text-red-800` + `dark:bg-red-900/30 dark:text-red-400` |
| Pendiente / Advertencia | `bg-yellow-100 text-yellow-800` + `dark:bg-yellow-900/30 dark:text-yellow-400` |
| Neutro | `bg-gray-100 text-gray-800` + `dark:bg-gray-900/30 dark:text-gray-400` |
| Info | `bg-blue-100 text-blue-800` + `dark:bg-blue-900/30 dark:text-blue-400` |

---

## 2. Layout de Páginas

### Estructura base de toda página
```tsx
<div className="w-full flex justify-center items-start gap-5">
  <div className="max-w-5xl w-full space-y-6">
    {/* Header de la página */}
    {/* Contenido principal */}
  </div>
</div>
```

### Anchos máximos según contexto
| Contexto | Clase |
|----------|-------|
| Páginas de lista/tablas | `max-w-5xl` |
| Dashboards / Cards | `max-w-4xl` |
| Formularios centrados | `max-w-md` |

---

## 3. Tipografía

| Elemento | Clases |
|----------|--------|
| Título de página (h1) | `text-2xl font-bold text-gray-900 dark:text-white` |
| Subtítulo / descripción | `text-gray-600 dark:text-gray-400` |
| Bienvenida (home) | `text-3xl font-bold text-gray-900 dark:text-white` |
| Headers de tabla | `text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider` |
| Celdas de tabla - dato principal | `text-sm text-gray-900 dark:text-white` |
| Celdas de tabla - dato secundario | `text-sm text-gray-600 dark:text-gray-300` |
| Labels de formulario | `text-sm font-medium text-gray-700 dark:text-gray-300` |
| Texto de card (home) | `text-lg font-semibold text-gray-900 dark:text-white` |
| Texto pequeño de card | `text-gray-600 dark:text-gray-400 text-sm` |
| Estado vacío - título | `text-lg font-medium text-gray-900 dark:text-white` |
| Estado vacío - descripción | `text-gray-600 dark:text-gray-400` |

---

## 4. Componentes

### 4.1 Cards / Contenedores

**Card estándar (tablas, listas):**
```
bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden
```

**Card de dashboard (home):**
```
bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700
```

**Card de formulario centrado:**
```
bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800
```

### 4.2 Botones

**Botón primario (acción principal):**
```
bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-700 transition-colors
```

**Botón de tabla (editar, ver):**
```
bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1
```

**Botón de submit (formulario):**
```
w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60
```

**Botón de icono (header, tema):**
```
p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
```

**Botón de cerrar (modal):**
```
text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors
```

### 4.3 Inputs

**Input de texto / email / password:**
```
w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
```

**Select:**
```
w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
```

### 4.4 Tablas

**Contenedor:**
```
overflow-x-auto
```

**Tabla:**
```
w-full
```

**Header:**
```
bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
```

**Celda header (th):**
```
px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
```

**Body:**
```
divide-y divide-gray-200 dark:divide-gray-700
```

**Fila (tr):**
```
hover:bg-gray-50 dark:hover:bg-gray-900/50
```

**Celda (td):**
```
px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white
```

### 4.5 Badges / Etiquetas de estado

**Base:**
```
px-2 py-1 text-xs rounded-full
```

**Variante activa:**
```
bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400
```

**Variante inactiva:**
```
bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400
```

### 4.6 Modales

**Backdrop:**
```
fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm
```

**Contenedor:**
```
bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 min-w-lg min-h-96 max-w-lg w-full
```

**Header del modal:**
```
flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2
```

### 4.7 Estado vacío

**Contenedor:**
```
text-center py-12
```

**Icono circular:**
```
bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center
```

**Título:**
```
text-lg font-medium text-gray-900 dark:text-white mb-2
```

**Descripción:**
```
text-gray-600 dark:text-gray-400
```

---

## 5. Animaciones

### Framer Motion - Entrada de elementos
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
```

### Framer Motion - Hover en cards
```tsx
<motion.div whileHover={{ scale: 1.02 }}>
```

### Framer Motion - Botones (whileTap)
```tsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
```

### Delay escalonado para elementos secuenciales
- Primer elemento: sin delay
- Segundo elemento: `delay: 0.1`
- Tercer elemento: `delay: 0.2`

---

## 6. Iconos

Librería: **lucide-react**

Tamaños estándar:
- Iconos en headers de tabla: `w-4 h-4`
- Iconos en botones: `w-4 h-4` (botón normal), `w-3 h-3` (botón pequeño)
- Iconos en estado vacío: `w-8 h-8`
- Iconos en header/theme toggle: `w-5 h-5`
- Iconos en sidebar: `w-5 h-5`

---

## 7. Espaciado

| Contexto | Clase |
|----------|-------|
| Gap entre secciones de página | `space-y-6` |
| Gap entre header y botón (responsive) | `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4` |
| Gap en formulario | `flex flex-col gap-4` |
| Gap en card de formulario | `flex flex-col gap-6` |
| Gap entre icono y texto | `gap-2` |
| Padding de celdas de tabla | `px-6 py-4` (celda), `px-6 py-3` (header) |
| Padding de cards dashboard | `p-6` |
| Padding de formulario centrado | `p-8` |

---

## 8. Responsive

| Breakpoint | Uso |
|------------|-----|
| `sm:` (640px) | Header de página pasa de columna a fila |
| `md:` (768px) | Grid de cards: 2 columnas |
| `lg:` (1024px) | Grid de cards: 3 columnas |

---

## 9. Tema oscuro

Todas las clases deben incluir su variante `dark:` correspondiente. El tema se activa con la clase `dark` en el elemento `<html>` (estrategia `class`).

**Regla:** Cada vez que se use un color en light mode, agregar su equivalente dark mode:
- `text-gray-900` → `dark:text-white`
- `text-gray-600` → `dark:text-gray-400`
- `bg-white` → `dark:bg-gray-800`
- `bg-gray-50` → `dark:bg-gray-900`
- `border-gray-200` → `dark:border-gray-700`

---

## 10. Estructura de archivos UI

```
app/src/
├── components/          # Componentes reutilizables
│   ├── ui/              # Primitivos (shadcn/radix)
│   ├── Modal.tsx
│   ├── Layout.tsx
│   └── ...
├── pages/               # Páginas completas
│   ├── HomePage.tsx
│   ├── UsersPage.tsx
│   └── RolesPage.tsx
├── hooks/               # Hooks personalizados
├── services/            # Llamadas a API
└── types/               # Interfaces TypeScript
```
