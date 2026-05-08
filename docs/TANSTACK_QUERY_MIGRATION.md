# Migración a TanStack Query

> Guía de migración del sistema de fetching tradicional a TanStack Query

## Resumen

Se ha migrado el sistema de fetching de datos de useState/useEffect tradicional a **TanStack Query** (anteriormente React Query) para mejorar:

- ✅ Caché automático de datos
- ✅ Revalidación en background
- ✅ Manejo de estados de loading/error
- ✅ Optimistic updates
- ✅ Sincronización entre componentes
- ✅ DevTools para debugging

## Estructura

```
src/
├── hooks/
│   ├── queries/           # Nuevos hooks de TanStack Query
│   │   ├── index.ts       # Exporta todos los hooks
│   │   ├── useUsers.ts    # Hooks para usuarios
│   │   ├── useRoles.ts    # Hooks para roles
│   │   ├── usePermissions.ts
│   │   └── useAudit.ts    # Hooks para auditoría
│   └── ...                # Hooks existentes
├── providers/
│   └── QueryProvider.tsx  # Provider de TanStack Query
└── pages/
    └── UsersPageRefactored.tsx  # Ejemplo de página migrada
```

## Instalación

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Configuración

### 1. QueryProvider

El `QueryProvider` ya está configurado en `src/providers/QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // Datos frescos por 5 minutos
      gcTime: 10 * 60 * 1000,      // Cache por 10 minutos
      retry: 1,                     // Reintentar 1 vez en error
      refetchOnWindowFocus: false,  // No refrescar al volver a la pestaña
    },
  },
});
```

### 2. Integración en App

El provider ya está integrado en `App.tsx`:

```typescript
<QueryProvider>
  <AuthProvider>
    <ThemeProvider>
      {/* ... */}
    </ThemeProvider>
  </AuthProvider>
</QueryProvider>
```

## Uso

### Query Hooks (GET)

```typescript
import { useUsers, useUser } from '../hooks/queries/useUsers';

// Lista de usuarios con paginación
function UsersList() {
  const { data, isLoading, error } = useUsers(1, 10, 'search');
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <UserTable data={data.data} />;
}

// Usuario específico
function UserDetail({ userId }: { userId: number }) {
  const { data: user, isLoading } = useUser(userId);
  
  if (isLoading) return <Loading />;
  
  return <div>{user.name}</div>;
}
```

### Mutation Hooks (POST/PUT/DELETE)

```typescript
import { useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/queries/useUsers';

function UserActions() {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const handleCreate = async (userData) => {
    try {
      await createUser.mutateAsync(userData);
      // Éxito - el cache se invalida automáticamente
    } catch (error) {
      // Error - ya mostrado en toast por el hook
    }
  };
  
  const handleUpdate = async (id, userData) => {
    await updateUser.mutateAsync({ id, data: userData });
  };
  
  const handleDelete = async (id) => {
    await deleteUser.mutateAsync(id);
  };
  
  return (
    <div>
      <button 
        onClick={handleCreate}
        disabled={createUser.isPending}
      >
        {createUser.isPending ? 'Creando...' : 'Crear'}
      </button>
    </div>
  );
}
```

## Beneficios vs useState/useEffect

### Antes (useState/useEffect)

```typescript
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersService.getAll();
        setUsers(data);
      } catch (err) {
        setError(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [page, search]);
  
  const handleCreate = async (userData) => {
    try {
      await usersService.create(userData);
      toast.success('Creado');
      // Refetch manual
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  // ... más código
}
```

### Después (TanStack Query)

```typescript
function UsersPage() {
  const { data, isLoading, error } = useUsers(page, 10, search);
  const createUser = useCreateUser();
  
  // Todo el manejo de estado, errores y cache es automático
  
  const handleCreate = async (userData) => {
    await createUser.mutateAsync(userData);
    // Cache se invalida automáticamente
  };
}
```

## DevTools

TanStack Query incluye DevTools para debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Ya está incluido en QueryProvider
// Presiona Ctrl+Shift+F en desarrollo para abrir
```

## Patrones Avanzados

### 1. Dependent Queries

```typescript
const { data: user } = useUser(userId);
const { data: permissions } = useUserPermissions(user?.role, {
  enabled: !!user?.role, // Solo ejecutar si hay rol
});
```

### 2. Optimistic Updates

```typescript
const updateUser = useMutation({
  mutationFn: updateUserApi,
  onMutate: async (newUser) => {
    // Cancelar queries pendientes
    await queryClient.cancelQueries({ queryKey: ['user', newUser.id] });
    
    // Guardar valor anterior
    const previousUser = queryClient.getQueryData(['user', newUser.id]);
    
    // Actualizar optimistamente
    queryClient.setQueryData(['user', newUser.id], newUser);
    
    return { previousUser };
  },
  onError: (err, newUser, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(['user', newUser.id], context.previousUser);
  },
});
```

### 3. Infinite Scroll

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['users'],
  queryFn: ({ pageParam = 1 }) => fetchUsers(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

### 4. Prefetching

```typescript
const queryClient = useQueryClient();

// Precargar datos cuando el usuario hace hover
const onMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 10 * 1000, // Fresco por 10 segundos
  });
};
```

## Migración Progresiva

No es necesario migrar todo de una vez. Se puede hacer gradualmente:

1. **Fase 1**: Instalar TanStack Query y crear hooks simples
2. **Fase 2**: Migrar páginas críticas (Users, Roles)
3. **Fase 3**: Migrar el resto de páginas
4. **Fase 4**: Optimizar con features avanzadas (optimistic updates, prefetching)

### Página de Ejemplo

Ver `UsersPageRefactored.tsx` para un ejemplo completo de página migrada.

## Troubleshooting

### Query no se ejecuta

```typescript
// Verificar que 'enabled' sea true
const { data } = useUser(userId, {
  enabled: !!userId, // Solo si userId existe
});
```

### Cache no se invalida

```typescript
// Usar queryClient.invalidateQueries con el key correcto
queryClient.invalidateQueries({ queryKey: ['users'] });
```

### Mutación no muestra error

```typescript
// Verificar que el hook maneje errores
const mutation = useMutation({
  mutationFn: apiCall,
  onError: (error) => {
    toast.error(error.message); // Mostrar error
  },
});
```

## Recursos

- [Documentación oficial](https://tanstack.com/query/latest)
- [React Query Tutorial](https://tanstack.com/query/latest/docs/react/overview)
- [Ejemplos](https://tanstack.com/query/latest/docs/react/examples)

## Notas

- Los hooks antiguos (`useTable`, etc.) siguen funcionando
- Se pueden usar gradualmente junto con TanStack Query
- Los servicios (`usersService`, etc.) no cambian
- Solo cambia la forma de consumir los servicios
