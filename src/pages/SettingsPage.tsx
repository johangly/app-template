import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Settings, Mail, Lock, Shield, Save } from 'lucide-react';
import { systemConfigService, SystemConfigItem } from '../services/systemConfigService';
import { NumberInput } from '../components/ui/number-input';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [configs, setConfigs] = useState<SystemConfigItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    async function fetchConfigs() {
        setLoading(true);
        try {
            const data = await systemConfigService.getAll();
            setConfigs(data);
        } catch {
            toast.error('Error al cargar la configuración');
        } finally {
            setLoading(false);
        }
    }

    const getValue = (config: SystemConfigItem) => {
        if (config.type === 'boolean') return config.value === 'true';
        if (config.type === 'number') return parseInt(config.value) || 0;
        return config.value;
    };

    const handleChange = (key: string, value: string | boolean | number) => {
        setConfigs(prev => prev.map(c =>
            c.key === key ? { ...c, value: String(value) } : c
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = configs.map(c => ({ key: c.key, value: c.value }));
            await systemConfigService.update(updates);
            toast.success('Configuración guardada exitosamente');
        } catch {
            toast.error('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const groupedConfigs = [
        {
            title: 'Seguridad',
            icon: Shield,
            items: configs.filter(c => ['max_login_attempts', 'lock_duration_minutes'].includes(c.key)),
        },
        {
            title: 'Recuperación de contraseña',
            icon: Mail,
            items: configs.filter(c => ['password_recovery_enabled'].includes(c.key)),
        },
    ];

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-3xl w-full space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-6 h-6" /> Configuración del Sistema
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Ajustes generales de seguridad y funcionalidades</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving || loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-blue-700 transition-colors disabled:opacity-50 h-10"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando configuración...</div>
                ) : (
                    groupedConfigs.map((group, groupIdx) => {
                        const Icon = group.icon;
                        return (
                            <motion.div
                                key={group.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: groupIdx * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Icon className="w-5 h-5" /> {group.title}
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {group.items.map((config) => (
                                        <div key={config.key} className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {config.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{config.key}</code>
                                                    </p>
                                                </div>
                                                {config.type === 'boolean' ? (
                                                    <button
                                                        onClick={() => handleChange(config.key, getValue(config) ? 'false' : 'true')}
                                                        className={twMerge(
                                                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                                                            getValue(config) ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                        )}
                                                    >
                                                        <span
                                                            className={twMerge(
                                                                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                                                getValue(config) ? 'translate-x-6' : 'translate-x-1'
                                                            )}
                                                        />
                                                    </button>
                                                ) : config.type === 'number' ? (
                                                    <NumberInput
                                                        value={getValue(config) as number}
                                                        onChange={(value) => handleChange(config.key, value)}
                                                        min={config.key === 'max_login_attempts' ? 1 : 1}
                                                        max={config.key === 'max_login_attempts' ? 10 : 60}
                                                        step={1}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={getValue(config) as string}
                                                        onChange={(e) => handleChange(config.key, e.target.value)}
                                                        className="w-64 h-10 px-3 rounded-lg border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Configuración SMTP
                        </h2>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            La configuración SMTP se gestiona mediante variables de entorno (<code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env</code>).
                        </p>
                        <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                            <p><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">SMTP_HOST</code> — Servidor SMTP (ej: smtp.resend.com)</p>
                            <p><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">SMTP_PORT</code> — Puerto (ej: 587)</p>
                            <p><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">SMTP_USER</code> — Usuario SMTP</p>
                            <p><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">SMTP_PASS</code> — Contraseña o API key</p>
                            <p><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">SMTP_FROM</code> — Dirección remitente</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
