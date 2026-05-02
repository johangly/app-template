import { Key } from 'lucide-react';

interface RolePermissionsFormProps {
    setModal: (value: boolean) => void;
    permissionsByResource: Record<string, { id: string; name: string; action: string }[]>;
    selectedPermissions: number[];
    togglePermission: (id: number) => void;
    savePermissions: () => void;
    loading: boolean;
}

export default function RolePermissionsForm({
    setModal,
    permissionsByResource,
    selectedPermissions,
    togglePermission,
    savePermissions,
    loading,
}: RolePermissionsFormProps) {
    return (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(permissionsByResource).map(([resource, permissions]) => (
                <div key={resource} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        {resource}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                            <label
                                key={permission.id}
                                className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(parseInt(permission.id))}
                                    onChange={() => togglePermission(parseInt(permission.id))}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                    {permission.action}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={savePermissions}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Permisos'}
                </button>
            </div>
        </div>
    );
}
