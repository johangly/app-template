import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Column<T> {
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading: boolean;
    search: string;
    onSearch: (search: string) => void;
    page: number;
    limit: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    emptyMessage?: string;
    searchPlaceholder?: string;
}

export default function DataTable<T extends { id: string | number }>({
    columns,
    data,
    loading,
    search,
    onSearch,
    page,
    limit,
    totalPages,
    total,
    onPageChange,
    onLimitChange,
    emptyMessage = 'No se encontraron resultados',
    searchPlaceholder = 'Buscar...',
}: DataTableProps<T>) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Mostrar</span>
                    <select
                        value={limit}
                        onChange={(e) => onLimitChange(parseInt(e.target.value))}
                        className="h-8 px-2 rounded border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900"
                    >
                        {[5, 10, 25, 50, 100].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <span>de {total} registros</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
                    </div>
                ) : data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.className || ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        {columns.map((col, idx) => (
                                            <td key={idx} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${col.className || ''}`}>
                                                {col.render(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{emptyMessage}</h3>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange(page - 1)}
                            className="h-8 px-3 rounded-lg border border-input bg-background text-sm hover:bg-accent transition-colors disabled:opacity-40 flex items-center gap-1"
                        >
                            <ChevronLeft className="w-3 h-3" /> Anterior
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange(page + 1)}
                            className="h-8 px-3 rounded-lg border border-input bg-background text-sm hover:bg-accent transition-colors disabled:opacity-40 flex items-center gap-1"
                        >
                            Siguiente <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
