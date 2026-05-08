# Guía Completa de TanStack Query

> Todo lo que necesitas saber sobre TanStack Query en español

## 📋 ÍNDICE

1. [¿Qué es TanStack Query?](#qué-es-tanstack-query)
2. [Conceptos Básicos](#conceptos-básicos)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Cómo Funciona](#cómo-funciona)
5. [Uso Práctico](#uso-práctico)
6. [Patrones Avanzados](#patrones-avanzados)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Troubleshooting](#troubleshooting)

---

## ¿Qué es TanStack Query?

TanStack Query (anteriormente React Query) es una librería para manejar el estado de datos del servidor en aplicaciones React. 

### ¿Por qué usarlo?

**Sin TanStack Query (useState/useEffect):**
```typescript
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await usersService.getAll();
        setUsers(data);
      } catch (err) {
        setError(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Problemas:
  // - No hay caché
  // - No se revalida automáticamente
  // - Cada componente hace su propia petición
  // - Mucho código boilerplate
}
```

**Con TanStack Query:**
```typescript
function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  
  // Ventajas:
  // ✅ Caché automática
  // ✅ Revalidación inteligente
  // ✅ Deduplicación de peticiones
  // ✅ Manejo de errores centralizado
  // ✅ ~80% menos código
}
```

---

## Conceptos Básicos

### 1. Query (Consulta de Datos)

Una **Query** es una operación de lectura (GET). TanStack Query la cachea automáticamente.

```typescript
import { useQuery } from '@tanstack/react-query';

// Definir una query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],           // Identificador único
  queryFn: fetchUsers,           // Función que obtiene los datos
  staleTime: 5 * 60 * 1000,     // Tiempo de frescura (5 min)
});
```

**Estados de una Query:**
- `isLoading`: Primera carga (no hay datos en caché)
- `isFetching`: Recargando datos (hay datos en caché)
- `isSuccess`: Datos cargados exitosamente
- `isError`: Error al cargar datos
- `data`: Los datos obtenidos
- `error`: El error (si hay)

### 2. Mutation (Modificación de Datos)

Una **Mutation** es una operación de escritura (POST, PUT, DELETE).

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const createUser = useMutation({
  mutationFn: createUserApi,           // Función que crea el usuario
  onSuccess: () => {
    // Cuando la mutación tiene éxito:
    queryClient.invalidateQueries({ queryKey: ['users'] });
    // Esto fuerza que la lista de usuarios se recargue
  },
});

// Usar la mutación
createUser.mutate({ name: 'John', email: 'john@example.com' });
```

**Estados de una Mutation:**
- `isPending`: La mutación está en progreso
- `isSuccess`: La mutación fue exitosa
- `isError`: La mutación falló
- `mutate()`: Función para ejecutar la mutación
- `mutateAsync()`: Versión async/await

### 3. Query Key (Clave de Consulta)

La **queryKey** es el identificador único de una query. Es un array que puede tener múltiples niveles.

```typescript
// Query simple
useQuery({ queryKey: ['users'], ... });

// Query con parámetros
useQuery({ queryKey: ['users', 1], ... });           // Usuario específico
useQuery({ queryKey: ['users', { page: 1 }], ... }); // Con filtros
useQuery({ queryKey: ['users', page, search], ... }); // Múltiples parámetros
```

**Reglas:**
- Cada query debe tener una key única
- Si cambia la key, se recarga la query
- Usa parámetros en la key para que se recargue cuando cambien

### 4. Cache y Stale Time

```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,     // Datos "frescos" por 5 minutos
  gcTime: 10 * 60 * 1000,       // Mantener en caché por 10 minutos
});
```

**Stale Time:**
- Tiempo durante el cual los datos se consideran "frescos"
- Mientras estén frescos, no se harán nuevas peticiones
- Después de este tiempo, se recargarán en background

**GC Time (Garbage Collection):**
- Tiempo que los datos permanecen en caché después de que ningún componente los use
- Después de este tiempo, se eliminan de memoria
- Si un componente vuelve a usar la query, se recargan

---

## Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Crear el Provider

Ya está creado en `src/providers/QueryProvider.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutos
      gcTime: 10 * 60 * 1000,      // 10 minutos
      retry: 1,                     // Reintentar 1 vez en error
      refetchOnWindowFocus: false,  // No refrescar al cambiar de pestaña
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. Integrar en App.tsx

Ya está integrado:

```typescript
function App() {
  return (
    <QueryProvider>              {/* 👈 Envolver toda la app */}
      <AuthProvider>
        <ThemeProvider>
          <Router>
            {/* ... rutas */}
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
```

---

## Cómo Funciona

### Flujo de una Query

```
1. Componente monta
   ↓
2. useQuery verifica caché
   ↓
   ├─ Si hay datos frescos → Usa caché ✅
   ↓
   └─ Si no hay datos o están stale → Hace fetch
      ↓
3. Muestra estado de loading
   ↓
4. Recibe datos
   ↓
5. Guarda en caché
   ↓
6. Muestra datos en UI
```

### Flujo de una Mutation

```
1. Usuario hace clic en "Crear"
   ↓
2. mutation.mutate() se ejecuta
   ↓
3. Estado isPending = true (muestra loading)
   ↓
4. Llama a la API
   ↓
5. Recibe respuesta
   ↓
6. Ejecuta onSuccess
   ├─ Muestra toast de éxito
   ├─ Invalida queries relacionadas
   └─ Recarga datos automáticamente
   ↓
7. Estado isSuccess = true
```

### Deduplicación de Peticiones

```typescript
// Componente A
function UserList() {
  const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  return <div>{/* muestra usuarios */}</div>;
}

// Componente B (en otra parte de la app)
function UserStats() {
  const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  return <div>{/* muestra estadísticas */}</div>;
}
```

**Resultado:**
- Ambos componentes comparten la misma query (misma key)
- Solo se hace **UNA** petición HTTP
- Ambos reciben los mismos datos
- Si uno actualiza, ambos se actualizan

---

## Uso Práctico

### Ejemplo 1: Listar Usuarios

```typescript
import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/usersService';

// Hook personalizado (recomendado)
export function useUsers(page = 1, limit = 10, search = '') {
  return useQuery({
    queryKey: ['users', { page, limit, search }],
    queryFn: () => usersService.getAll({ page, limit, search }),
    staleTime: 5 * 60 * 1000,
  });
}

// Uso en componente
function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { 
    data,           // Los datos (users)
    isLoading,      // true en primera carga
    isFetching,     // true en cualquier carga (incluye background)
    error,          // Error si falló
    refetch,        // Función para recargar manualmente
  } = useUsers(page, 10, search);
  
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
      />
      
      {isFetching && <span>Actualizando...</span>}
      
      <ul>
        {data?.data.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      
      <button onClick={() => setPage(p => p - 1)}>Anterior</button>
      <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
      
      <button onClick={() => refetch()}>Recargar</button>
    </div>
  );
}
```

### Ejemplo 2: Crear Usuario

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/usersService';
import toast from 'react-hot-toast';

// Hook personalizado
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.create,
    
    // Se ejecuta ANTES de la mutación
    onMutate: async (newUser) => {
      // Cancelar queries pendientes
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Guardar valor anterior
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistic update (actualizar UI antes de la respuesta)
      queryClient.setQueryData(['users'], (old: any) => ({
        ...old,
        data: [...old.data, { ...newUser, id: Date.now() }],
      }));
      
      return { previousUsers };
    },
    
    // Se ejecuta cuando la mutación tiene éxito
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      
      // Invalidar cache para recargar datos
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    
    // Se ejecuta si hay error
    onError: (error: any, newUser, context) => {
      // Revertir optimistic update
      queryClient.setQueryData(['users'], context?.previousUsers);
      
      toast.error(error.message || 'Error al crear usuario');
    },
  });
}

// Uso en componente
function CreateUserForm() {
  const createUser = useCreateUser();
  const [name, setName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createUser.mutateAsync({ name });
      setName(''); // Limpiar formulario
    } catch (error) {
      // Error ya manejado por el hook
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={createUser.isPending}
      />
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creando...' : 'Crear'}
      </button>
    </form>
  );
}
```

### Ejemplo 3: Detalle de Usuario

```typescript
export function useUser(id: number | null) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getById(id!),
    enabled: !!id,  // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000,
  });
}

function UserDetail({ userId }: { userId: number }) {
  const { data: user, isLoading } = useUser(userId);
  
  if (isLoading) return <div>Cargando usuario...</div>;
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

### Ejemplo 4: Actualizar Usuario

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      usersService.update(id, data),
    
    onSuccess: (_, variables) => {
      toast.success('Usuario actualizado');
      
      // Invalidar queries específicas
      queryClient.invalidateQueries({ 
        queryKey: ['user', variables.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['users'] 
      });
    },
  });
}
```

### Ejemplo 5: Eliminar Usuario

```typescript
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.delete,
    
    onSuccess: () => {
      toast.success('Usuario eliminado');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

function DeleteButton({ userId }: { userId: number }) {
  const deleteUser = useDeleteUser();
  
  const handleDelete = () => {
    if (confirm('¿Estás seguro?')) {
      deleteUser.mutate(userId);
    }
  };
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteUser.isPending}
    >
      {deleteUser.isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
```

---

## Patrones Avanzados

### 1. Queries Dependientes

```typescript
// Primero cargamos el usuario
const { data: user } = useUser(userId);

// Luego cargamos sus permisos (solo si hay usuario)
const { data: permissions } = useUserPermissions(user?.roleId, {
  enabled: !!user?.roleId,
});
```

### 2. Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      usersService.getAll({ page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
  });
}

function UserList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers();
  
  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.map(user => <UserCard key={user.id} user={user} />)}
        </div>
      ))}
      
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
      </button>
    </div>
  );
}
```

### 3. Prefetching

```typescript
const queryClient = useQueryClient();

function UserList() {
  // Precargar datos cuando el usuario pasa el mouse
  const prefetchUser = (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => usersService.getById(userId),
      staleTime: 10 * 1000, // Fresco por 10 segundos
    });
  };
  
  return (
    <ul>
      {users.map(user => (
        <li 
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### 4. Optimistic Updates Completo

```typescript
const updateUser = useMutation({
  mutationFn: updateUserApi,
  
  onMutate: async (newUser) => {
    // Cancelar queries que podrían sobrescribir nuestro optimistic update
    await queryClient.cancelQueries({ queryKey: ['user', newUser.id] });
    await queryClient.cancelQueries({ queryKey: ['users'] });
    
    // Guardar estado anterior
    const previousUser = queryClient.getQueryData(['user', newUser.id]);
    const previousUsers = queryClient.getQueryData(['users']);
    
    // Aplicar optimistic update
    queryClient.setQueryData(['user', newUser.id], newUser);
    queryClient.setQueryData(['users'], (old: any) => ({
      ...old,
      data: old.data.map((u: any) => 
        u.id === newUser.id ? newUser : u
      ),
    }));
    
    return { previousUser, previousUsers };
  },
  
  onError: (err, newUser, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(['user', newUser.id], context?.previousUser);
    queryClient.setQueryData(['users'], context?.previousUsers);
    
    toast.error('Error al actualizar');
  },
  
  onSettled: (newUser) => {
    // Siempre invalidar después de error o éxito
    queryClient.invalidateQueries({ queryKey: ['user', newUser?.id] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

---

## Mejores Prácticas

### 1. Usar Hooks Personalizados

❌ **NO:**
```typescript
function Component() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
```

✅ **SÍ:**
```typescript
// En un archivo separado
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

// En el componente
function Component() {
  const { data } = useUsers();
}
```

### 2. Key Consistente

```typescript
// Siempre usar el mismo formato de key
useQuery({ queryKey: ['users', userId], ... });      // ✅
useQuery({ queryKey: ['user', userId], ... });       // ❌ Diferente!
useQuery({ queryKey: [`users-${userId}`], ... });    // ❌ String, no array!
```

### 3. Manejo de Errores

```typescript
const { error, isError } = useUsers();

// Mostrar error en UI
if (isError) {
  return (
    <div className="error">
      <p>Error: {error.message}</p>
      <button onClick={() => refetch()}>Reintentar</button>
    </div>
  );
}
```

### 4. Selectores (Transformar Datos)

```typescript
const { data: activeUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (data) => data.filter(user => user.isActive),
});
```

### 5. Paginación con keepPreviousData

```typescript
const { data, isPlaceholderData } = useQuery({
  queryKey: ['users', page],
  queryFn: () => fetchUsers(page),
  placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
});
```

---

## Troubleshooting

### Problema: Query no se ejecuta

**Causa:** La opción `enabled` está en false

```typescript
const { data } = useUser(userId, {
  enabled: !!userId, // Si userId es null, no se ejecuta
});
```

**Solución:** Asegúrate de que `enabled` sea true cuando quieras que se ejecute.

### Problema: Cache no se invalida

**Causa:** Key incorrecta en invalidateQueries

```typescript
// ❌ Key incorrecta
queryClient.invalidateQueries({ queryKey: ['user'] });

// ✅ Key correcta
queryClient.invalidateQueries({ queryKey: ['users'] });
```

### Problema: Datos desactualizados

**Causa:** Stale time muy alto

```typescript
// Datos se consideran frescos por 1 hora
staleTime: 60 * 60 * 1000
```

**Solución:** Reducir staleTime o usar `refetchInterval`

### Problema: Mutación no muestra loading

**Causa:** Usando `mutate` en lugar de `mutateAsync`

```typescript
// ❌ No puedes usar await
mutate(data);

// ✅ Puedes usar await y try/catch
await mutateAsync(data);
```

---

## Referencia Rápida

### Comandos Útiles

```typescript
// Obtener datos del cache
const data = queryClient.getQueryData(['users']);

// Establecer datos manualmente
queryClient.setQueryData(['users'], newData);

// Invalidar queries
queryClient.invalidateQueries({ queryKey: ['users'] });

// Cancelar queries
queryClient.cancelQueries({ queryKey: ['users'] });

// Limpiar cache
queryClient.clear();

// Refetch manual
const { refetch } = useUsers();
refetch();
```

### Opciones de Query

```typescript
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  
  // Tiempo de frescura (default: 0)
  staleTime: 5 * 60 * 1000,
  
  // Tiempo en caché (default: 5 min)
  gcTime: 10 * 60 * 1000,
  
  // Reintentos en error (default: 3)
  retry: 1,
  
  // Delay entre reintentos
  retryDelay: 1000,
  
  // Refetch al enfocar ventana
  refetchOnWindowFocus: true,
  
  // Refetch al reconectar
  refetchOnReconnect: true,
  
  // Ejecutar query
  enabled: true,
  
  // Intervalo de refetch (polling)
  refetchInterval: false,
  
  // Transformar datos
  select: (data) => data.filter(...),
  
  // Callbacks
  onSuccess: (data) => {},
  onError: (error) => {},
  onSettled: (data, error) => {},
});
```

---

## Recursos Adicionales

- 📚 [Documentación Oficial](https://tanstack.com/query/latest)
- 🎥 [React Query Tutorial](https://www.youtube.com/watch?v=JMWcE9pAoC0)
- 💻 [Ejemplos Prácticos](https://tanstack.com/query/latest/docs/react/examples)
- 🔧 [DevTools Guide](https://tanstack.com/query/latest/docs/react/devtools)

---

**¿Preguntas?** Revisa la sección de Troubleshooting o consulta la documentación oficial.
