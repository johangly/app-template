import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { CheckCircle, Mail, Plus, Search, User, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useUser from '../hooks/useUser';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function UsersPage() {
    const {
        allUsers,
        openCreateModal,
        openEditModal,
        closeModal,
        showUserModal,
        form,
        handleChange,
        handleSubmit,
        loading,
        error,
        idEditingUser,
        roleOptions,
        handleDelete,
    } = useUser();
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-5xl w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Usuarios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona los usuarios del sistema
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
                            Agregar Usuario
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    {allUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Nombre
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Estado
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {allUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {user.userRole?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    user.isActive
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {user.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                        onClick={() => openEditModal(user)}
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-60"
                                                        onClick={() => setUserToDelete({ id: parseInt(user.id), name: user.name })}
                                                        disabled={user.id === '1'}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
                                No se encontraron usuarios
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Comienza agregando tu primer usuario
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                <AnimatePresence>
                    {showUserModal && (
                        <Modal title={idEditingUser ? 'Editar Usuario' : 'Crear Usuario'} setModal={closeModal}>
                            <UserForm
                                setModal={closeModal}
                                form={form}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                                idEditingUser={idEditingUser}
                                roleOptions={roleOptions}
                                password=""
                            />
                        </Modal>
                    )}
                </AnimatePresence>

                {userToDelete && (
                    <ConfirmDialog
                        isOpen={!!userToDelete}
                        onClose={() => setUserToDelete(null)}
                        onConfirm={() => {
                            handleDelete(userToDelete.id);
                            setUserToDelete(null);
                        }}
                        title="Eliminar Usuario"
                        message={`¿Estás seguro de eliminar al usuario "${userToDelete.name}"? Esta acción no se puede deshacer.`}
                        confirmButtonText="Eliminar"
                        isLoading={loading}
                    />
                )}
            </div>
        </div>
    );
}
