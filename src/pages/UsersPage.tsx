import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Plus, Edit, Trash2, Lock, Unlock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import useUser from '../hooks/useUser';
import useTable from '../hooks/useTable';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import { usersService } from '../services/usersService';
import { UserGetResponse } from '../types/users';
import toast from 'react-hot-toast';

export default function UsersPage() {
    const {
        openCreateModal,
        openEditModal,
        closeModal,
        showUserModal,
        form,
        handleChange,
        handleSubmit,
        loading: formLoading,
        error,
        idEditingUser,
        roleOptions,
        handleDelete,
        fetchAllUsers,
    } = useUser();
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

    const table = useTable<UserGetResponse>({
        fetchFn: (params) => usersService.getPaginatedUsers(params),
        initialLimit: 10,
    });

    const handleUnlock = async (id: number, name: string) => {
        try {
            await usersService.unlockUser(id);
            toast.success(`Usuario "${name}" desbloqueado`);
            table.refresh();
        } catch {
            toast.error('Error al desbloquear el usuario');
        }
    };

    const isLocked = (user: UserGetResponse) => {
        return user.lockUntil && new Date(user.lockUntil) > new Date();
    };

    const columns = [
        {
            header: 'Nombre',
            render: (user: UserGetResponse) => user.name,
        },
        {
            header: 'Email',
            render: (user: UserGetResponse) => user.email,
        },
        {
            header: 'Rol',
            render: (user: UserGetResponse) => user.userRole?.name || '-',
        },
        {
            header: 'Estado',
            render: (user: UserGetResponse) => (
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    {isLocked(user) && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Bloqueado
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Acciones',
            render: (user: UserGetResponse) => (
                <div className="flex gap-2">
                    {isLocked(user) && (
                        <button
                            className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-700 transition-colors flex items-center gap-1"
                            onClick={() => handleUnlock(parseInt(user.id), user.name)}
                        >
                            <Unlock className="w-3 h-3" /> Desbloquear
                        </button>
                    )}
                    <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                        onClick={() => openEditModal(user)}
                    >
                        <Edit className="w-3 h-3" /> Editar
                    </button>
                    <button
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-60"
                        onClick={() => setUserToDelete({ id: parseInt(user.id), name: user.name })}
                        disabled={user.id === '1'}
                    >
                        <Trash2 className="w-3 h-3" /> Eliminar
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-6xl w-full space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-6 h-6" /> Usuarios
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Gestiona los usuarios del sistema</p>
                        </div>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-700 transition-colors"
                            onClick={openCreateModal}
                        >
                            <Plus className="w-4 h-4" /> Agregar Usuario
                        </button>
                    </div>
                </motion.div>

                <DataTable
                    columns={columns}
                    data={table.data}
                    loading={table.loading}
                    search={table.search}
                    onSearch={table.setSearch}
                    page={table.page}
                    limit={table.limit}
                    totalPages={table.totalPages}
                    total={table.total}
                    onPageChange={table.setPage}
                    onLimitChange={table.setLimit}
                    emptyMessage="No se encontraron usuarios"
                    searchPlaceholder="Buscar por nombre, email o código..."
                />

                <AnimatePresence>
                    {showUserModal && (
                        <Modal title={idEditingUser ? 'Editar Usuario' : 'Crear Usuario'} setModal={closeModal}>
                            <UserForm
                                setModal={closeModal}
                                form={form}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                loading={formLoading}
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
                            table.refresh();
                        }}
                        title="Eliminar Usuario"
                        message={`¿Estás seguro de eliminar al usuario "${userToDelete.name}"? Esta acción no se puede deshacer.`}
                        confirmButtonText="Eliminar"
                        isLoading={formLoading}
                    />
                )}
            </div>
        </div>
    );
}
