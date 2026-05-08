import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../services/auditService';
import toast from 'react-hot-toast';

// Query keys
const AUDIT_LOGS_KEY = 'audit-logs';
const AUDIT_CONFIG_KEY = 'audit-config';

// Get audit logs with filters
export const useAuditLogs = (filters: {
  page?: number;
  limit?: number;
  userId?: number;
  resource?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
} = {}) => {
  return useQuery({
    queryKey: [AUDIT_LOGS_KEY, filters],
    queryFn: () => auditService.getAll(filters),
    staleTime: 1 * 60 * 1000, // 1 minute - audit logs change frequently
  });
};

// Get audit configuration
export const useAuditConfig = () => {
  return useQuery({
    queryKey: [AUDIT_CONFIG_KEY],
    queryFn: auditService.getConfig,
    staleTime: 5 * 60 * 1000,
  });
};

// Update audit configuration
export const useUpdateAuditConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auditService.updateConfig,
    onSuccess: () => {
      toast.success('Configuración de auditoría actualizada');
      queryClient.invalidateQueries({ queryKey: [AUDIT_CONFIG_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar configuración');
    },
  });
};

// Clear old audit logs
export const useClearAuditLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auditService.clearOldLogs,
    onSuccess: () => {
      toast.success('Logs antiguos eliminados');
      queryClient.invalidateQueries({ queryKey: [AUDIT_LOGS_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar logs');
    },
  });
};
