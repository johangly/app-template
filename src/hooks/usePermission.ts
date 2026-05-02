import { useAuth } from './useAuth';

export function usePermission(resource: string, action: string): boolean {
    const { user } = useAuth();

    if (!user || !user.permissions) {
        return false;
    }

    return user.permissions.some(
        (p) => p.resource === resource && (p.action === action || p.action === '*')
    );
}

export function useHasAnyPermission(permissions: { resource: string; action: string }[]): boolean {
    const { user } = useAuth();

    if (!user || !user.permissions) {
        return false;
    }

    return permissions.some(({ resource, action }) =>
        user.permissions.some(
            (p) => p.resource === resource && (p.action === action || p.action === '*')
        )
    );
}
