import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Plus, Search, Edit, Trash2, Key } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import PermissionForm from '../components/PermissionForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { rolesService } from '../services/rolesService';
import { PermissionGetResponse } from '../types/users';
import toast from 'react-hot-toast';

const emptyState = { name: '', description: '', resource: '', action: '' };

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<PermissionGetResponse[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyState);
    const [idEditing, setIdEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openCreate = () => {
        setIdEditing(null);
        setForm(emptyState);
        setShowModal(true);
    };

    const openEdit = (perm: PermissionGetResponse) => {
        setIdEditing(perm.id);
        setForm({
            name: perm.name,
            description: perm.description,
            resource: perm.resource,
            action: perm.action,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.description || !form.resource || !form.action) {
            setError('Todos los campos son obligatorios');
            return;
        }
        setLoading(true);
        try {
            if (idEditing) {
                await rolesService.updatePermission(parseInt(idEditing), form);
                toast.success('Permiso actualizado');
            } else {
                await rolesService.createPermission(form);
                toast.success('Permiso creado');
            }
            setShowModal(false);
            fetchPermissions();
        } catch (err) {
            if (err instanceof Error) toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setLoading(true);
        try {
            await rolesService.deletePermission(parseInt(deleteTarget.id));
            toast.success('Permiso eliminado');
            setDeleteTarget(null);
            fetchPermissions();
        } catch (err) {
            if (err instanceof Error) toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    async function fetchPermissions() {
        try {
            const data = await rolesService.getAllPermissions();
            setPermissions(data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchPermissions(); }, []);

    const grouped = permissions.reduce<Record<string, PermissionGetResponse[]>>((acc, p) => {
        if (!acc[p.resource]) acc[p.resource] = [];
        acc[p.resource].push(p);
        return acc;
    }, {});

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-5xl w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Key className="w-6 h-6" /> Permisos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Crea y gestiona los permisos del sistema</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" /> Nuevo Permiso
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    {permissions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2"><Key className="w-4 h-4" /> Nombre</div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {Object.entries(grouped).map(([resource, perms]) =>
                                        perms.map((perm, idx) => (
                                            <tr key={perm.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                {idx === 0 && (
                                                    <td rowSpan={perms.length} className="px-6 py-4 align-top text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-mono">
                                                            {resource}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                                                    {perm.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                                                        {perm.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openEdit(perm)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1">
                                                            <Edit className="w-3 h-3" /> Editar
                                                        </button>
                                                        <button onClick={() => setDeleteTarget({ id: perm.id, name: perm.name })} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center gap-1">
                                                            <Trash2 className="w-3 h-3" /> Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay permisos</h3>
                            <p className="text-gray-600 dark:text-gray-400">Crea tu primer permiso para comenzar</p>
                        </motion.div>
                    )}
                </motion.div>

                <AnimatePresence>
                    {showModal && (
                        <Modal title={idEditing ? 'Editar Permiso' : 'Nuevo Permiso'} setModal={() => setShowModal(false)}>
                            <PermissionForm
                                setModal={() => setShowModal(false)}
                                form={form}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                                idEditing={idEditing}
                            />
                        </Modal>
                    )}
                </AnimatePresence>

                {deleteTarget && (
                    <ConfirmDialog
                        isOpen
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={handleDelete}
                        title="Eliminar Permiso"
                        message={`¿Eliminar "${deleteTarget.name}"? Se desasignará de todos los roles.`}
                        confirmButtonText="Eliminar"
                        isLoading={loading}
                    />
                )}
            </div>
        </div>
    );
}
