export interface Login{
    email: string;
    password: string;
}
export interface LoginGetResponse{
    token: string;
    message: string;
    user: {
        id: string;
        code: string;
        name: string;
        email: string;
        roleId: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        lastLogin: string | null;
    }
}