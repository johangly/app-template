import FormField from './FormField';
import FormSelect from './FormSelect';

interface UserFormProps {
    setModal: (value: boolean) => void;
    form: { name: string; email: string; roleId: number; password: string; confirmPassword: string; isActive: boolean };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    idEditingUser: string | null;
    roleOptions: { id: string; name: string }[];
    password: string;
}

export default function UserForm({
    setModal,
    form,
    handleChange,
    handleSubmit,
    loading,
    error,
    idEditingUser,
    roleOptions,
}: UserFormProps) {
    const fields = [
        { label: 'Nombre completo', type: 'text' as const, name: 'name', placeholder: 'Tu nombre' },
        { label: 'Correo electrónico', type: 'email' as const, name: 'email', placeholder: 'ejemplo@correo.com' },
        { label: 'Contraseña', type: 'password' as const, name: 'password', placeholder: idEditingUser ? '•••••••• (dejar vacío para mantener)' : '••••••••' },
        { label: 'Confirmar contraseña', type: 'password' as const, name: 'confirmPassword', placeholder: '••••••••' },
    ];

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <FormSelect
                label="Rol"
                value={form.roleId ? form.roleId.toString() : ''}
                onValueChange={(val) => handleChange({ target: { name: 'roleId', value: val } } as React.ChangeEvent<HTMLSelectElement>)}
                options={roleOptions.map(r => ({ value: r.id, label: r.name }))}
                placeholder="Seleccione un rol"
            />

            {fields.map((field) => (
                <FormField
                    key={field.name}
                    id={field.name}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={form[field.name as keyof typeof form] as string}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={!idEditingUser && field.type === 'password'}
                />
            ))}

            {idEditingUser && (
                <div className="flex items-center gap-3 pt-2">
                    <input
                        id="isActive"
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Usuario activo
                    </label>
                </div>
            )}

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 h-10"
                disabled={loading}
            >
                {loading ? 'Guardando...' : idEditingUser ? 'Actualizar' : 'Crear'}
            </button>
        </form>
    );
}
