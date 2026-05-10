import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '../lib/validations';
import { useEffect } from 'react';

interface UserFormProps {
    setModal: (value: boolean) => void;
    form: { name: string; email: string; roleId: number; password: string; confirmPassword: string; isActive: boolean };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    idEditingUser: string | null;
    roleOptions: { id: string; name: string }[];
    password: string;
}

export default function UserForm({
    setModal,
    form,
    handleChange,
    handleSubmit: originalHandleSubmit,
    loading,
    error,
    idEditingUser,
    roleOptions,
}: UserFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: form.name,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            roleId: form.roleId,
            isActive: form.isActive,
        },
    });

    // Sincronizar con form externo
    useEffect(() => {
        reset({
            name: form.name,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            roleId: form.roleId,
            isActive: form.isActive,
        });
    }, [form, reset]);

    const onSubmit = (data: UserFormData) => {
        // Actualizar form externo
        Object.entries(data).forEach(([key, value]) => {
            handleChange({
                target: { name: key, value: key === 'roleId' ? Number(value) : value }
            } as React.ChangeEvent<HTMLInputElement>);
        });
        
        // Llamar submit original
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        originalHandleSubmit(fakeEvent);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Rol */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol
                </label>
                <Controller
                    name="roleId"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                                errors.roleId ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                            }`}
                        >
                            <option value="">Seleccione un rol</option>
                            {roleOptions.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors.roleId && (
                    <p className="text-xs text-red-500 mt-1">{errors.roleId.message}</p>
                )}
            </div>

            {/* Nombre */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre completo
                </label>
                <input
                    {...register("name")}
                    type="text"
                    placeholder="Tu nombre"
                    className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo electrónico
                </label>
                <input
                    {...register("email")}
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Contraseña */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña
                </label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder={idEditingUser ? '•••••••• (dejar vacío para mantener)' : '••••••••'}
                    className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmar contraseña
                </label>
                <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Usuario activo (solo edición) */}
            {idEditingUser && (
                <div className="flex items-center gap-3 pt-2">
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                        )}
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Usuario activo
                    </label>
                </div>
            )}

            {/* Error general */}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            {/* Botón */}
            <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 h-10"
                disabled={loading}
            >
                {loading ? 'Guardando...' : idEditingUser ? 'Actualizar' : 'Crear'}
            </button>
        </form>
    );
}