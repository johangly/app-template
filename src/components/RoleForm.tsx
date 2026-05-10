import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleFormData } from '../lib/validations';
import { Key } from 'lucide-react';
import { useEffect } from 'react';

interface RoleFormProps {
    setModal: (value: boolean) => void;
    form: { name: string; description: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    idEditingRole: string | null;
    selectedPermissions: number[];
    permissionsByResource: Record<string, { id: string; name: string; action: string }[]>;
    togglePermission: (id: number) => void;
    saveRolePermissions: () => void;
}

export default function RoleForm({
    setModal,
    form,
    handleChange,
    handleSubmit: originalHandleSubmit,
    loading,
    error,
    idEditingRole,
    selectedPermissions,
    permissionsByResource,
    togglePermission,
    saveRolePermissions,
}: RoleFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: form.name,
            description: form.description,
        },
    });

    useEffect(() => {
        reset({
            name: form.name,
            description: form.description,
        });
    }, [form, reset]);

    const onSubmit = (data: RoleFormData) => {
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
                    placeholder="Nombre del rol"
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
                <textarea
                    {...register("description")}
                    placeholder="Descripción del rol"
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    }`}
                />
                {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Permisos
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(permissionsByResource).map(([resource, permissions]) => (
                        <div key={resource}>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 capitalize">
                                {resource}
                            </p>
                            <div className="grid grid-cols-2 gap-1">
                                {permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex items-center gap-2 p-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(parseInt(permission.id))}
                                            onChange={() => togglePermission(parseInt(permission.id))}
                                            className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                                            {permission.action}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 h-10"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : idEditingRole ? 'Actualizar' : 'Crear'}
                </button>
                {idEditingRole && (
                    <button
                        type="button"
                        onClick={saveRolePermissions}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 h-10"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Solo Permisos'}
                    </button>
                )}
            </div>
        </form>
    );
}