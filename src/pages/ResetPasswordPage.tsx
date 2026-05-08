import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [validToken, setValidToken] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (!token) {
            setValidating(false);
            return;
        }
        authService.verifyResetToken(token)
            .then(result => {
                setValidToken(result.valid);
                if (result.valid && result.email) {
                    setUserEmail(result.email);
                }
            })
            .catch(() => setValidToken(false))
            .finally(() => setValidating(false));
    }, [token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            toast.success('Contraseña actualizada exitosamente');
            navigate('/login');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Error al restablecer la contraseña');
            }
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Verificando enlace...</p>
                </div>
            </div>
        );
    }

    if (!token || !validToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-800 text-center">
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enlace inválido</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Este enlace ha expirado o no es válido. Solicita un nuevo enlace de restablecimiento.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                    >
                        Solicitar nuevo enlace
                    </Link>
                    <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Volver al login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva contraseña</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        Ingresa tu nueva contraseña para <span className="font-medium text-gray-700 dark:text-gray-300">{userEmail}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full h-10 px-4 pr-10 rounded-lg border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite la contraseña"
                                className="w-full h-10 px-4 pr-10 rounded-lg border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                        <button
                            type="submit"
                            disabled={loading || !password || !confirmPassword}
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                        {loading ? 'Guardando...' : 'Restablecer contraseña'}
                    </button>

                    <div className="text-center">
                        <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Volver al login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
