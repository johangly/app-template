import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/queries/useUsers';
import { useRoles } from '../hooks/queries/useRoles';
import DataTable from '../components/DataTable';
import { Button } from '../components/ui/button';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import toast from 'react-hot-toast';

export default function UsersPageRefactored() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // TanStack Query hooks
  const { data: usersData, isLoading, error } = useUsers(page, 10, search);
  const { data: rolesData } = useRoles();
  
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    isActive: true,
  });

  const handleCreate = async () => {
    try {
      await createUser.mutateAsync(formData);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    
    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        data: formData,
      });
      setIsModalOpen(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  const handleDelete = async (user: any) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
      try {
        await deleteUser.mutateAsync(user.id);
      } catch (error) {
        // Error is already handled by the mutation
      }
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't show password
      role: user.role?.toString() || '',
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      isActive: true,
    });
  };

  const columns = [
    { key: 'code', header: 'Código' },
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Rol',
      render: (user: any) => rolesData?.find((r: any) => r.id === user.role)?.name || 'N/A'
    },
    { 
      key: 'isActive', 
      header: 'Estado',
      render: (user: any) => (
        <span className={`px-2 py-1 rounded text-sm ${
          user.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (user: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(user)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(user)}
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600">
          Error al cargar usuarios: {error.message}
        </div>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button 
          onClick={() => {
            setEditingUser(null);
            resetForm();
            setIsModalOpen(true);
          }}
        >
          Nuevo Usuario
        </Button>
      </div>

      <DataTable
        data={usersData?.data || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          page,
          totalPages: usersData?.pagination?.totalPages || 1,
          onPageChange: setPage,
        }}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Buscar usuarios...',
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          resetForm();
        }}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          roles={rolesData || []}
          isLoading={createUser.isPending || updateUser.isPending}
          isEditing={!!editingUser}
        />
      </Modal>
    </div>
  );
}
