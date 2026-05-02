import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { usersService } from '../services/usersService';
import toast from 'react-hot-toast';
import { RoleGetResponse, UserGetResponse } from '../types/users';
import { useAuth } from './useAuth';

const dataUserEmptyState = {
    name: '',
    email: '',
    roleId: 0,
    password: '',
    confirmPassword: '',
    isActive: true,
}

export default function useUser() {
    const { user } = useAuth();
    const [form, setForm] = useState(dataUserEmptyState);
    const [allRoles, setAllRoles] = useState<RoleGetResponse[]>([]);
    const [allUsers, setAllUsers] = useState<UserGetResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [idEditingUser, setIdEditingUser] = useState<string | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [password, setPassword] = useState('');

    const userPermissions = user?.permissions || [];
    const userPermissionIds = userPermissions.map((p) => parseInt(p.id));

    const availableRoles = allRoles.filter((role) => {
        const rolePermIds = role.permissions?.map((p) => parseInt(p.id)) || [];
        return rolePermIds.every((id) => userPermissionIds.includes(id));
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setForm({ ...form, [target.name]: target.name === 'roleId' ? parseInt(value as string) : value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (idEditingUser) {
            if (!form.name || !form.email) {
                setError('Nombre y correo electrónico son obligatorios');
                return;
            }
            setLoading(true);
            try {
                await usersService.updateUser(parseInt(idEditingUser), {
                    name: form.name,
                    email: form.email,
                    roleId: form.roleId,
                    password: form.password ? form.password : password,
                    isActive: form.isActive,
                });
                toast.success('Usuario actualizado exitosamente');
                closeModal();
                fetchAllUsers();
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(`Error al actualizar el usuario: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
            return;
        }
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            await usersService.createUser({
                name: form.name,
                email: form.email,
                roleId: form.roleId,
                password: form.password,
            });
            toast.success('Usuario registrado exitosamente');
            closeModal();
            fetchAllUsers();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Error al registrar el usuario: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setIdEditingUser(null);
        setForm(dataUserEmptyState);
        setPassword('');
        setError('');
        setShowUserModal(true);
    };

    const openEditModal = async (userItem: UserGetResponse) => {
        setIdEditingUser(userItem.id);
        setForm({
            name: userItem.name,
            email: userItem.email,
            roleId: parseInt(userItem.role),
            password: '',
            confirmPassword: '',
            isActive: userItem.isActive,
        });
        setPassword(userItem.password);
        setError('');
        setShowUserModal(true);
    };

    const closeModal = () => {
        setShowUserModal(false);
        setIdEditingUser(null);
        setForm(dataUserEmptyState);
        setPassword('');
        setError('');
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await usersService.deleteUser(id);
            toast.success('Usuario eliminado exitosamente');
            fetchAllUsers();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Error al eliminar el usuario: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    async function fetchAllUsers() {
        try {
            const users = await usersService.getAllUsers();
            setAllUsers(users);
        } catch (err) {
            console.error('Error al obtener los usuarios:', err);
        }
    }
    async function fetchRoles() {
        try {
            const roles = await usersService.getAllRoles();
            setAllRoles(roles);
            const defaultRole = roles.find((role) => role.name === 'User');
            if (defaultRole) {
                setForm((prevForm) => ({
                    ...prevForm,
                    roleId: parseInt(defaultRole.id)
                }));
            }
        } catch (err) {
            console.error('Error al obtener los roles:', err);
        }
    }
    useEffect(() => {
        fetchRoles();
        fetchAllUsers();
    }, []);
    return {
        form,
        setForm,
        handleChange,
        handleSubmit,
        loading,
        error,
        roleOptions: availableRoles,
        allUsers,
        idEditingUser,
        password,
        showUserModal,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDelete,
        fetchAllUsers,
    };
}
