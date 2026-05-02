import { Key } from 'lucide-react';

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
    handleSubmit,
    loading,
    error,
    idEditingRole,
    selectedPermissions,
    permissionsByResource,
    togglePermission,
    saveRolePermissions,
}: RoleFormProps) {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nombre del rol"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descripción del rol"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                />
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : idEditingRole ? 'Actualizar' : 'Crear'}
                </button>
                {idEditingRole && (
                    <button
                        type="button"
                        onClick={saveRolePermissions}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Solo Permisos'}
                    </button>
                )}
            </div>
        </form>
    );
}
