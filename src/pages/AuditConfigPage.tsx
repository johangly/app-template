import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Settings } from 'lucide-react';
import { auditService, AuditConfigResponse } from '../services/auditService';
import toast from 'react-hot-toast';

export default function AuditConfigPage() {
    const [configs, setConfigs] = useState<AuditConfigResponse[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchConfig() {
        try {
            const data = await auditService.getConfig();
            setConfigs(data);
        } catch {
            // ignore
        }
    }

    useEffect(() => { fetchConfig(); }, []);

    const toggleConfig = async (id: number, current: boolean) => {
        setLoading(true);
        try {
            const updated = await auditService.updateConfig([{ id, enabled: !current }]);
            setConfigs(updated);
            toast.success('Configuración actualizada');
        } catch {
            toast.error('Error al actualizar');
        } finally {
            setLoading(false);
        }
    };

    const grouped = configs.reduce<Record<string, AuditConfigResponse[]>>((acc, c) => {
        if (!acc[c.resource]) acc[c.resource] = [];
        acc[c.resource].push(c);
        return acc;
    }, {});

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-4xl w-full space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-6 h-6" /> Config. Auditoría
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Habilita o deshabilita la auditoría por recurso y acción</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recurso</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acción</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auditar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {Object.entries(grouped).map(([resource, items]) =>
                                    items.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                            {idx === 0 && (
                                                <td rowSpan={items.length} className="px-6 py-4 align-top text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                                    {resource}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                                                {item.action}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.enabled}
                                                        onChange={() => toggleConfig(parseInt(item.id), item.enabled)}
                                                        disabled={loading}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
