import FormField from './FormField';
import FormSelect from './FormSelect';

interface PermissionFormProps {
    setModal: (value: boolean) => void;
    form: { name: string; description: string; resource: string; action: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    idEditing: string | null;
}

export default function PermissionForm({
    setModal,
    form,
    handleChange,
    handleSubmit,
    loading,
    error,
    idEditing,
}: PermissionFormProps) {
    const actionOptions = [
        { value: 'create', label: 'create' },
        { value: 'read', label: 'read' },
        { value: 'update', label: 'update' },
        { value: 'delete', label: 'delete' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="name"
                label="Nombre"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="ej: inventario:create"
                required
            />
            <FormField
                id="description"
                label="Descripción"
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Permission to create inventory items"
                required
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id="resource"
                    label="Resource"
                    type="text"
                    name="resource"
                    value={form.resource}
                    onChange={handleChange}
                    placeholder="inventario"
                    required
                />
                <FormSelect
                    label="Action"
                    value={form.action}
                    onValueChange={(val) => handleChange({ target: { name: 'action', value: val } } as React.ChangeEvent<HTMLSelectElement>)}
                    options={actionOptions}
                    placeholder="Seleccionar"
                />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg disabled:opacity-60 h-10"
                disabled={loading}
            >
                {loading ? 'Guardando...' : idEditing ? 'Actualizar' : 'Crear'}
            </button>
        </form>
    );
}
