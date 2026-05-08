import { createContext, ReactNode, useEffect, useState } from "react";
import { loginService } from "../services/loginService";
import { LoginGetResponse } from "../types/auth";
import toast from "react-hot-toast";
import { jwtDecode } from 'jwt-decode';
import { ApiError } from "../services/api";

interface AuthContextType {
  user: LoginGetResponse["user"] | null;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginGetResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser: LoginGetResponse["user"] = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginService.login({ email, password });
      setUser(response.user);
      localStorage.setItem("token", response.token);
      toast.success("Inicio de sesión exitoso");
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        const message = err.message;
        const remainingAttempts = err.data?.remainingAttempts;
        
        if (remainingAttempts !== undefined) {
          toast.error(`${message}. Intentos restantes: ${remainingAttempts}`);
        } else {
          toast.error(message);
        }
        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await loginService.logout(user?.email);
      setUser(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
