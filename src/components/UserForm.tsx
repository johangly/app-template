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
    const inputs = [
        {
            label: 'Nombre completo',
            type: 'text',
            name: 'name',
            value: form.name,
            placeholder: 'Tu nombre',
        },
        {
            label: 'Correo electrónico',
            type: 'email',
            name: 'email',
            value: form.email,
            placeholder: 'ejemplo@correo.com',
        },
        {
            label: 'Rol',
            type: 'select',
            name: 'roleId',
            value: form.roleId,
            options: roleOptions,
        },
        {
            label: 'Contraseña',
            type: 'password',
            name: 'password',
            value: form.password,
            placeholder: idEditingUser ? '•••••••• (dejar vacío para mantener)' : '••••••••',
        },
        {
            label: 'Confirmar contraseña',
            type: 'password',
            name: 'confirmPassword',
            value: form.confirmPassword,
            placeholder: '••••••••',
        },
    ];

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {inputs.map((input, idx) => (
                <div key={idx}>
                    <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {input.label}
                    </label>
                    {input.type === 'select' ? (
                        <select
                            id={input.name}
                            name={input.name}
                            value={input.value}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>Seleccione un rol</option>
                            {input.options?.map((option) => (
                                <option key={option.id} value={parseInt(option.id)}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={input.name}
                            type={input.type}
                            name={input.name}
                            value={input.value}
                            onChange={handleChange}
                            placeholder={input.placeholder}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!idEditingUser && input.type === 'password'}
                        />
                    )}
                </div>
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
                className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                disabled={loading}
            >
                {loading ? 'Guardando...' : idEditingUser ? 'Actualizar' : 'Crear'}
            </button>
        </form>
    );
}
