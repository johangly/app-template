import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/usersService';
import toast from 'react-hot-toast';

// Query keys
const USERS_KEY = 'users';
const USER_KEY = 'user';

// Get all users with pagination
export const useUsers = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: [USERS_KEY, { page, limit, search }],
    queryFn: () => usersService.getAll({ page, limit, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID
export const useUser = (id: number | null) => {
  return useQuery({
    queryKey: [USER_KEY, id],
    queryFn: () => usersService.getById(id!),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000,
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear usuario');
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      usersService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Usuario actualizado exitosamente');
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: [USER_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar usuario');
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar usuario');
    },
  });
};

// Unlock user account
export const useUnlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.unlock,
    onSuccess: () => {
      toast.success('Usuario desbloqueado exitosamente');
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al desbloquear usuario');
    },
  });
};
