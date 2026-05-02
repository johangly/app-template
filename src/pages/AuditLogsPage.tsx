import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Search, History, User, Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { auditService, AuditLogResponse } from '../services/auditService';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLogResponse[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<{ resource?: string; action?: string; search?: string }>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showCleanup, setShowCleanup] = useState(false);

    const limit = 50;

    async function fetchLogs() {
        setLoading(true);
        try {
            const result = await auditService.getLogs({ page, limit, ...filters });
            setLogs(result.data);
            setTotal(result.total);
            setTotalPages(result.totalPages);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLogs();
    }, [page, filters]);

    const handleCleanup = async () => {
        try {
            await auditService.cleanupLogs(90);
            setShowCleanup(false);
            fetchLogs();
        } catch {
            // ignore
        }
    };

    const actionBadge = (action: string) => {
        const map: Record<string, string> = {
            login: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            logout: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            read: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            update: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return map[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    };

    const uniqueResources = [...new Set(logs.map((l) => l.resource))];
    const uniqueActions = [...new Set(logs.map((l) => l.action))];

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-6xl w-full space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <History className="w-6 h-6" /> Auditoría
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">{total} eventos registrados</p>
                        </div>
                        <button
                            onClick={() => setShowCleanup(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-red-700 transition-colors text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> Limpiar logs
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                >
                    <div className="flex flex-wrap gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Recurso</label>
                            <select
                                value={filters.resource || ''}
                                onChange={(e) => { setFilters((f) => ({ ...f, resource: e.target.value || undefined })); setPage(1); }}
                                className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                {uniqueResources.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Acción</label>
                            <select
                                value={filters.action || ''}
                                onChange={(e) => { setFilters((f) => ({ ...f, action: e.target.value || undefined })); setPage(1); }}
                                className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todas</option>
                                {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Buscar</label>
                            <input
                                value={filters.search || ''}
                                onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value || undefined })); setPage(1); }}
                                placeholder="Buscar en descripción..."
                                className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    {logs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Fecha</div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2"><User className="w-3 h-3" /> Usuario</div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acción</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recurso</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {logs.map((log) => (
                                        <>
                                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {log.userEmail || '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${actionBadge(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono">
                                                        {log.resource}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                                    {log.description}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {(log.oldValues || log.newValues) && (
                                                        expandedId === log.id
                                                            ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                                            : <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </td>
                                            </tr>
                                            {expandedId === log.id && (log.oldValues || log.newValues) && (
                                                <tr key={`${log.id}-detail`}>
                                                    <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            {log.oldValues && (
                                                                <div>
                                                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Valores anteriores:</p>
                                                                    <pre className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs text-gray-600 dark:text-gray-400 max-h-60">
                                                                        {JSON.stringify(log.oldValues, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                            {log.newValues && (
                                                                <div>
                                                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Valores nuevos:</p>
                                                                    <pre className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs text-gray-600 dark:text-gray-400 max-h-60">
                                                                        {JSON.stringify(log.newValues, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sin resultados</h3>
                            <p className="text-gray-600 dark:text-gray-400">No hay eventos de auditoría con esos filtros</p>
                        </div>
                    )}
                </motion.div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >Anterior</button>
                        <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">Pág. {page} de {totalPages}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >Siguiente</button>
                    </div>
                )}

                {showCleanup && (
                    <ConfirmDialog
                        isOpen
                        onClose={() => setShowCleanup(false)}
                        onConfirm={handleCleanup}
                        title="Limpiar logs"
                        message="¿Eliminar todos los logs de auditoría con más de 90 días?"
                        confirmButtonText="Limpiar"
                    />
                )}
            </div>
        </div>
    );
}
