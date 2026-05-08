import { request } from "./api";

class AuthService {
    async forgotPassword(email: string): Promise<{ message: string }> {
        return request<{ message: string }>("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token: string, password: string): Promise<{ message: string }> {
        return request<{ message: string }>("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });
    }

    async verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
        return request<{ valid: boolean; email?: string }>(`/auth/verify-reset-token/${token}`);
    }

    async testEmailConnection(): Promise<{ success: boolean; error?: string }> {
        return request<{ success: boolean; error?: string }>("/auth/test-email", {
            method: "POST",
        });
    }
}

export const authService = new AuthService();
