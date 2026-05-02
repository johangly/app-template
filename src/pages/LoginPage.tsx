import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            <Toaster />
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 text-center mb-2">Iniciar sesión</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Bienvenido, ingresa tus credenciales para continuar</p>
                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                    loading={loading}
                />
                <div className="text-center mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">¿Olvidaste tu contraseña?</span>
                </div>
                <div className="text-center mt-2">
                    <a href="/register-user" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Registrar usuario</a>
                </div>
            </div>
        </div>
    );
}
