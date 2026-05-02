import { ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';

interface RequirePermissionProps {
    resource: string;
    action: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export default function RequirePermission({ resource, action, children, fallback }: RequirePermissionProps) {
    const hasPermission = usePermission(resource, action);

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
