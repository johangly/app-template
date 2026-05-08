import { useQuery } from '@tanstack/react-query';
import { permissionService } from '../services/permissionService';

// Query keys
const PERMISSIONS_KEY = 'permissions';

// Get all permissions
export const usePermissions = () => {
  return useQuery({
    queryKey: [PERMISSIONS_KEY],
    queryFn: permissionService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions rarely change
  });
};

// Get permissions by resource
export const usePermissionsByResource = (resource: string) => {
  return useQuery({
    queryKey: [PERMISSIONS_KEY, 'resource', resource],
    queryFn: () => permissionService.getByResource(resource),
    enabled: !!resource,
    staleTime: 10 * 60 * 1000,
  });
};
