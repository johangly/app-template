import { useMemo } from 'react';
import { Home, Users, Shield, Key, History, Settings, type LucideIcon } from 'lucide-react';
import { useAuth } from './useAuth';
import type { MenuItem } from '../types';

const resourceConfig: Record<string, { label: string; icon: LucideIcon; path: string; parent?: string }> = {
    users: { label: 'Usuarios', icon: Users, path: '/users', parent: 'admin' },
    roles: { label: 'Roles', icon: Shield, path: '/roles', parent: 'admin' },
    permissions: { label: 'Permisos', icon: Key, path: '/permissions', parent: 'admin' },
    'audit-logs': { label: 'Auditoría', icon: History, path: '/audit-logs', parent: 'admin' },
    'audit-config': { label: 'Config. Auditoría', icon: Settings, path: '/audit-config', parent: 'admin' },
    'system-config': { label: 'Configuración', icon: Settings, path: '/settings', parent: 'admin' },
};

export default function useMenuItems(): MenuItem[] {
    const { user } = useAuth();

    return useMemo(() => {
        const items: MenuItem[] = [
            { id: 'home', label: 'Inicio', icon: Home, path: '/home' },
        ];

        const permissions = user?.permissions || [];
        const canRead = (resource: string) =>
            permissions.some((p) => p.resource === resource && (p.action === 'read' || p.action === '*'));

        const adminSubItems: MenuItem[] = [];

        for (const [resource, config] of Object.entries(resourceConfig)) {
            if (canRead(resource) && config.parent === 'admin') {
                adminSubItems.push({
                    id: resource,
                    label: config.label,
                    icon: config.icon,
                    path: config.path,
                });
            }
        }

        if (adminSubItems.length > 0) {
            items.push({
                id: 'admin',
                label: 'Administración',
                icon: Shield,
                subItems: adminSubItems,
            });
        }

        return items;
    }, [user?.permissions]);
}
