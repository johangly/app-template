import useUser from '../hooks/useUser';

interface UserProps {
    showSelectRole: boolean;
}

export default function UserForm({ showSelectRole }: UserProps) {
    const { handleChange, handleSubmit, loading, error, roleOptions, form,id } = useUser();
    let inputs = [
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
            options: [
                ...roleOptions
            ],
        },
        {
            label: 'Contraseña',
            type: 'password',
            name: 'password',
            value: form.password,
            placeholder: '••••••••',
        },
        {
            label: 'Confirmar contraseña',
            type: 'password',
            name: 'confirmPassword',
            value: form.confirmPassword,
            placeholder: '••••••••',
        },
    ];
    inputs = showSelectRole ? (
        inputs
    ) : (
        inputs.filter(input => input.name !== 'roleId')
    );
    console.log(inputs)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 text-center mb-2">{id ? 'Editar' : 'Registrar'} usuario</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">{id ? 'Actualiza los datos del usuario' : 'Crea una cuenta nueva para acceder al sistema'}</p>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {inputs.map((input, idx) => (

                        <div key={idx}>
                            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{input.label}</label>
                            {input.type === 'select' ? (
                                <select
                                    id={input.name}
                                    name={input.name}
                                    value={ input.value }
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
                                input.name === 'role' && !showSelectRole ? null : (
                                    <input
                                        id={input.name}
                                        type={input.type}
                                        name={input.name}
                                        value={input.value}
                                    onChange={handleChange}
                                    placeholder={input.placeholder}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                )
                            )}
                        </div>
                    ))}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading && id ? 'Actualizando...' : loading && !id ? 'Registrando...' : id ? 'Editar' : 'Registrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
