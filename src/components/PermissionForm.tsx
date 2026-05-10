import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { permissionSchema, PermissionFormData } from '../lib/validations';
import { useEffect } from 'react';

interface PermissionFormProps {
    setModal: (value: boolean) => void;
    form: { name: string; description: string; resource: string; action: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    idEditing: string | null;
}

export default function PermissionForm({
    setModal,
    form,
    handleChange,
    handleSubmit: originalHandleSubmit,
    loading,
    error,
    idEditing,
}: PermissionFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<PermissionFormData>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            name: form.name,
            description: form.description,
            resource: form.resource,
            action: form.action as any,
        },
    });

    const actionOptions = [
        { value: 'create', label: 'create' },
        { value: 'read', label: 'read' },
        { value: 'update', label: 'update' },
        { value: 'delete', label: 'delete' },
    ];

    useEffect(() => {
        reset({
            name: form.name,
            description: form.description,
            resource: form.resource,
            action: form.action as any,
        });
    }, [form, reset]);

    const onSubmit = (data: PermissionFormData) => {
        Object.entries(data).forEach(([key, value]) => {
            handleChange({
                target: { name: key, value }
            } as React.ChangeEvent<HTMLInputElement>);
        });
        
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        originalHandleSubmit(fakeEvent);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre
                </label>
                <input
                    {...register("name")}
                    type="text"
                    placeholder="ej: inventario:create"
                    className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                </label>
                <input
                    {...register("description")}
                    type="text"
                    placeholder="Permission to create inventory items"
                    className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Resource */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resource
                    </label>
                    <input
                        {...register("resource")}
                        type="text"
                        placeholder="inventario"
                        className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                            errors.resource ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                        }`}
                    />
                    {errors.resource && (
                        <p className="text-xs text-red-500 mt-1">{errors.resource.message}</p>
                    )}
                </div>

                {/* Action */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Action
                    </label>
                    <Controller
                        name="action"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className={`w-full h-10 px-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                                    errors.action ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                                }`}
                            >
                                <option value="">Seleccionar</option>
                                {actionOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.action && (
                        <p className="text-xs text-red-500 mt-1">{errors.action.message}</p>
                    )}
                </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg disabled:opacity-60 h-10"
                disabled={loading}
            >
                {loading ? 'Guardando...' : idEditing ? 'Actualizar' : 'Crear'}
            </button>
        </form>
    );
}