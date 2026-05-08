export interface UserPost{
    name: string;
    email: string;
    roleId: number;
    password: string;
    isActive?: boolean;
}
export interface UserGetResponse{
    id: string;
    name: string;
    email: string;
    code: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    password: string;
    updatedAt: string;
    lastLogin: string | null;
    loginAttempts: number;
    lockUntil: string | null;
    userRole: {
        id: string;
        name: string;
    }
}
export interface RoleGetResponse{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    permissions?: PermissionGetResponse[];
}
export interface PermissionGetResponse{
    id: string;
    name: string;
    description: string;
    resource: string;
    action: string;
    createdAt: string;
    updatedAt: string;
}
export interface PermissionPost{
    name: string;
    description: string;
    resource: string;
    action: string;
}
