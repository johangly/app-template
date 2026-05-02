import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
                    placeholder="ej: inventario:create"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                </label>
                <input
                    id="description"
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Permission to create inventory items"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="resource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resource
                    </label>
                    <input
                        id="resource"
                        type="text"
                        name="resource"
                        value={form.resource}
                        onChange={handleChange}
                        placeholder="inventario"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
                    <Select
                        value={form.action}
                        onValueChange={(val) => handleChange({ target: { name: 'action', value: val } } as React.ChangeEvent<HTMLSelectElement>)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="create">create</SelectItem>
                            <SelectItem value="read">read</SelectItem>
                            <SelectItem value="update">update</SelectItem>
                            <SelectItem value="delete">delete</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg disabled:opacity-60"
                disabled={loading}
            >
                {loading ? 'Guardando...' : idEditing ? 'Actualizar' : 'Crear'}
            </button>
        </form>
    );
}
