import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { rolesService } from '../services/rolesService';
import toast from 'react-hot-toast';
import { PermissionGetResponse, RoleGetResponse } from '../types/users';
import { useAuth } from './useAuth';

const emptyRoleState = {
    name: '',
    description: '',
};

export default function useRole() {
    const { user } = useAuth();
    const [form, setForm] = useState(emptyRoleState);
    const [allRoles, setAllRoles] = useState<RoleGetResponse[]>([]);
    const [allPermissions, setAllPermissions] = useState<PermissionGetResponse[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [idEditingRole, setIdEditingRole] = useState<string | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [currentRoleId, setCurrentRoleId] = useState<number | null>(null);

    const userPermissions = user?.permissions || [];
    const userPermissionIds = userPermissions.map((p) => parseInt(p.id));

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.description) {
            setError('Nombre y descripción son obligatorios');
            return;
        }

        setLoading(true);
        try {
            if (idEditingRole) {
                await rolesService.updateRole(parseInt(idEditingRole), {
                    name: form.name,
                    description: form.description,
                });
                toast.success('Rol actualizado exitosamente');
            } else {
                await rolesService.createRole({
                    name: form.name,
                    description: form.description,
                    permissionIds: selectedPermissions,
                });
                toast.success('Rol creado exitosamente');
            }
            closeModal();
            fetchAllRoles();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Error al guardar el rol: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setIdEditingRole(null);
        setForm(emptyRoleState);
        setSelectedPermissions([]);
        setShowRoleModal(true);
    };

    const openEditModal = (role: RoleGetResponse) => {
        setIdEditingRole(role.id);
        setForm({
            name: role.name,
            description: role.description,
        });
        setSelectedPermissions(role.permissions?.map((p) => parseInt(p.id)) || []);
        setShowRoleModal(true);
    };

    const closeModal = () => {
        setShowRoleModal(false);
        setIdEditingRole(null);
        setForm(emptyRoleState);
        setSelectedPermissions([]);
        setError('');
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await rolesService.deleteRole(id);
            toast.success('Rol eliminado exitosamente');
            fetchAllRoles();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Error al eliminar el rol: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    async function fetchAllRoles() {
        try {
            const roles = await rolesService.getAllRoles();
            setAllRoles(roles);
        } catch (err) {
            console.error('Error al obtener los roles:', err);
        }
    }

    async function fetchAllPermissions() {
        try {
            const permissions = await rolesService.getAllPermissions();
            setAllPermissions(permissions);
        } catch (err) {
            console.error('Error al obtener los permisos:', err);
        }
    }

    async function openPermissionsModal(roleId: number) {
        setCurrentRoleId(roleId);
        setShowPermissionsModal(true);
        try {
            const rolePermissions = await rolesService.getRolePermissions(roleId);
            setSelectedPermissions(rolePermissions.map((p) => parseInt(p.id)));
        } catch (err) {
            console.error('Error al obtener permisos del rol:', err);
            setSelectedPermissions([]);
        }
    }

    const closePermissionsModal = () => {
        setShowPermissionsModal(false);
        setCurrentRoleId(null);
        setSelectedPermissions([]);
    };

    const togglePermission = (permissionId: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const savePermissions = async () => {
        if (!currentRoleId) return;
        setLoading(true);
        try {
            await rolesService.updateRolePermissions(currentRoleId, selectedPermissions);
            toast.success('Permisos actualizados exitosamente');
            closePermissionsModal();
            fetchAllRoles();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Error al actualizar permisos: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const saveRolePermissions = async () => {
        if (!idEditingRole) return;
        setLoading(true);
        try {
            await rolesService.updateRolePermissions(parseInt(idEditingRole), selectedPermissions);
            toast.success('Permisos actualizados exitosamente');
            fetchAllRoles();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Error al actualizar permisos: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const canManagePermission = (permissionId: number): boolean => {
        return userPermissionIds.includes(permissionId);
    };

    const manageablePermissions = allPermissions.filter((p) => canManagePermission(parseInt(p.id)));

    useEffect(() => {
        fetchAllRoles();
        fetchAllPermissions();
    }, []);

    const permissionsByResource = manageablePermissions.reduce<Record<string, PermissionGetResponse[]>>((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {});

    const permissionsByResourceAll = allPermissions.reduce<Record<string, PermissionGetResponse[]>>((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {});

    const roleHasMorePermissions = (role: RoleGetResponse): boolean => {
        const rolePermIds = role.permissions?.map((p) => parseInt(p.id)) || [];
        return rolePermIds.some((id) => !userPermissionIds.includes(id));
    };

    const manageableRoles = allRoles.filter((role) => !roleHasMorePermissions(role));

    const availableRolesForUsers = allRoles.filter((role) => {
        const rolePermIds = role.permissions?.map((p) => parseInt(p.id)) || [];
        return rolePermIds.every((id) => userPermissionIds.includes(id));
    });

    return {
        form,
        setForm,
        allRoles,
        allPermissions,
        permissionsByResource,
        permissionsByResourceAll,
        selectedPermissions,
        loading,
        error,
        idEditingRole,
        showRoleModal,
        showPermissionsModal,
        handleChange,
        handleSubmit,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDelete,
        openPermissionsModal,
        closePermissionsModal,
        togglePermission,
        savePermissions,
        saveRolePermissions,
        fetchAllRoles,
        manageableRoles,
        availableRolesForUsers,
        roleHasMorePermissions,
    };
}
