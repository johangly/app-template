import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
            toast.success('Si el correo existe, recibirás un enlace para restablecer tu contraseña');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Error al procesar la solicitud');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {sent ? 'Correo enviado' : '¿Olvidaste tu contraseña?'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        {sent
                            ? 'Te hemos enviado un enlace para restablecer tu contraseña'
                            : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla'}
                    </p>
                </div>

                {sent ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Revisa tu bandeja de entrada y sigue las instrucciones del correo.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver al login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                className="w-full h-10 px-4 rounded-lg border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                        <div className="text-center">
                            <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Volver al login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
