export interface UserPost{
    name: string;
    email: string;
    roleId: number;
    password: string;
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
}
