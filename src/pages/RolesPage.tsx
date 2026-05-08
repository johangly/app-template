import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Plus, Search, Edit, Trash2, Shield, Lock } from 'lucide-react';
import { useState } from 'react';
import useRole from '../hooks/useRole';
import RoleForm from '../components/RoleForm';
import RolePermissionsForm from '../components/RolePermissionsForm';
import Modal from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function RolesPage() {
    const {
        allRoles,
        openCreateModal,
        openEditModal,
        closeModal,
        showRoleModal,
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
        openPermissionsModal,
        closePermissionsModal,
        showPermissionsModal,
        permissionsByResourceAll,
        savePermissions,
        handleDelete,
        roleHasMorePermissions,
    } = useRole();
    const [roleToDelete, setRoleToDelete] = useState<{ id: number; name: string } | null>(null);

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-5xl w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-6 h-6" /> Roles
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona los roles y permisos del sistema
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-700 transition-colors"
                            onClick={openCreateModal}
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Rol
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    {allRoles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Nombre
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Permisos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {allRoles.map((role) => {
                                        const hasMorePerms = roleHasMorePermissions(role);
                                        return (
                                            <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                    <div className="flex items-center gap-2">
                                                        {role.name}
                                                        {hasMorePerms && (
                                                            <Lock className="w-3 h-3 text-gray-400" title="No puedes gestionar este rol" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {role.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                                                        onClick={() => openPermissionsModal(parseInt(role.id))}
                                                    >
                                                        <Shield className="w-3 h-3" />
                                                        {role.permissions?.length || 0} permisos
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => openEditModal(role)}
                                                            disabled={hasMorePerms}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => setRoleToDelete({ id: parseInt(role.id), name: role.name })}
                                                            disabled={role.name.toLowerCase() === 'admin' || hasMorePerms}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No se encontraron roles
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Comienza agregando tu primer rol
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                <AnimatePresence>
                    {showRoleModal && (
                        <Modal title={idEditingRole ? 'Editar Rol' : 'Crear Nuevo Rol'} setModal={closeModal}>
                            <RoleForm
                                setModal={closeModal}
                                form={form}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                                idEditingRole={idEditingRole}
                                selectedPermissions={selectedPermissions}
                                permissionsByResource={permissionsByResource}
                                togglePermission={togglePermission}
                                saveRolePermissions={saveRolePermissions}
                            />
                        </Modal>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showPermissionsModal && (
                        <Modal title="Gestionar Permisos" setModal={closePermissionsModal}>
                            <RolePermissionsForm
                                setModal={closePermissionsModal}
                                permissionsByResource={permissionsByResourceAll}
                                selectedPermissions={selectedPermissions}
                                togglePermission={togglePermission}
                                savePermissions={savePermissions}
                                loading={loading}
                            />
                        </Modal>
                    )}
                </AnimatePresence>

                {roleToDelete && (
                    <ConfirmDialog
                        isOpen={!!roleToDelete}
                        onClose={() => setRoleToDelete(null)}
                        onConfirm={() => {
                            handleDelete(roleToDelete.id);
                            setRoleToDelete(null);
                        }}
                        title="Eliminar Rol"
                        message={`¿Estás seguro de eliminar el rol "${roleToDelete.name}"? Esta acción no se puede deshacer.`}
                        confirmButtonText="Eliminar"
                        isLoading={loading}
                    />
                )}
            </div>
        </div>
    );
}
