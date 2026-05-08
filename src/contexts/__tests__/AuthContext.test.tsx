import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { loginService } from '../../services/loginService';
import toast from 'react-hot-toast';

// Mock services
jest.mock('../../services/loginService');
jest.mock('react-hot-toast');

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    id: 1,
    email: 'test@example.com',
    role: 1
  }))
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should have initial state with no user', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(true);
    });

    it('should check for existing token in localStorage', () => {
      localStorage.setItem('token', 'valid-token');
      
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Should try to decode token and set user
      expect(result.current.loading).toBe(true);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        token: 'new-token',
        user: {
          id: 1,
          email: 'test@example.com',
          role: 1
        }
      };

      (loginService.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const success = await result.current.login('test@example.com', 'password');
        expect(success).toBe(true);
      });

      expect(loginService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
      expect(toast.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
      expect(result.current.user).toEqual(mockResponse.user);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (loginService.login as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const success = await result.current.login('test@example.com', 'wrong');
        expect(success).toBe(false);
      });

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should show remaining attempts on failed login', async () => {
      const apiError = {
        message: 'Invalid credentials',
        data: { remainingAttempts: 3 }
      };
      (loginService.login as jest.Mock).mockRejectedValue(apiError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'wrong');
      });

      expect(toast.error).toHaveBeenCalledWith(
        'Invalid credentials. Intentos restantes: 3'
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      localStorage.setItem('token', 'valid-token');
      (loginService.logout as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useAuth(), { wrapper });

      // First login
      const mockResponse = {
        token: 'token',
        user: { id: 1, email: 'test@example.com', role: 1 }
      };
      (loginService.login as jest.Mock).mockResolvedValue(mockResponse);

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(loginService.logout).toHaveBeenCalledWith('test@example.com');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle logout error gracefully', async () => {
      (loginService.logout as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.logout();
      });

      // Should not throw, just log error
      expect(result.current.loading).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is set', async () => {
      const mockResponse = {
        token: 'token',
        user: { id: 1, email: 'test@example.com', role: 1 }
      };
      (loginService.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return false when user is null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
