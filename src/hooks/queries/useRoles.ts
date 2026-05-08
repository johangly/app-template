import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '../services/rolesService';
import toast from 'react-hot-toast';

// Query keys
const ROLES_KEY = 'roles';
const ROLE_KEY = 'role';

// Get all roles
export const useRoles = () => {
  return useQuery({
    queryKey: [ROLES_KEY],
    queryFn: rolesService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes - roles don't change often
  });
};

// Get role by ID
export const useRole = (id: number | null) => {
  return useQuery({
    queryKey: [ROLE_KEY, id],
    queryFn: () => rolesService.getById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Get role permissions
export const useRolePermissions = (roleId: number | null) => {
  return useQuery({
    queryKey: [ROLE_KEY, roleId, 'permissions'],
    queryFn: () => rolesService.getPermissions(roleId!),
    enabled: !!roleId,
    staleTime: 10 * 60 * 1000,
  });
};

// Create role
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => {
      toast.success('Rol creado exitosamente');
      queryClient.invalidateQueries({ queryKey: [ROLES_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear rol');
    },
  });
};

// Update role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      rolesService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Rol actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: [ROLE_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ROLES_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar rol');
    },
  });
};

// Delete role
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesService.delete,
    onSuccess: () => {
      toast.success('Rol eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: [ROLES_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar rol');
    },
  });
};

// Update role permissions
export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: number; permissions: number[] }) =>
      rolesService.updatePermissions(roleId, permissions),
    onSuccess: (_, variables) => {
      toast.success('Permisos actualizados exitosamente');
      queryClient.invalidateQueries({ 
        queryKey: [ROLE_KEY, variables.roleId, 'permissions'] 
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar permisos');
    },
  });
};
