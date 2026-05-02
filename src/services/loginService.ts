import { request } from './api';
import { Login, LoginGetResponse } from '../types/auth'

class LoginService {
    async login(credentials: Login): Promise<LoginGetResponse> {
        return request<LoginGetResponse>('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async logout(email: string): Promise<void> {
        // El logout no necesita un manejo de error especial con toast
        return request<void>('/users/logout', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }
}
export const loginService = new LoginService();