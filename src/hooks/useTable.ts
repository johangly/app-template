import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTableOptions<T> {
    fetchFn: (params: { page: number; limit: number; search?: string }) => Promise<{ data: T[]; total: number; page: number; totalPages: number }>;
    initialLimit?: number;
}

interface UseTableReturn<T> {
    data: T[];
    loading: boolean;
    page: number;
    limit: number;
    totalPages: number;
    total: number;
    search: string;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    refresh: () => void;
}

export default function useTable<T>({ fetchFn, initialLimit = 10 }: UseTableOptions<T>): UseTableReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchFnRef = useRef(fetchFn);
    fetchFnRef.current = fetchFn;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounce(search);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await fetchFnRef.current({ page, limit, search: searchDebounce || undefined });
                if (!cancelled) {
                    setData(result.data);
                    setTotalPages(result.totalPages);
                    setTotal(result.total);
                }
            } catch {
                // ignore
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => { cancelled = true; };
    }, [page, limit, searchDebounce, refreshKey]);

    const refresh = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    return {
        data,
        loading,
        page,
        limit,
        totalPages,
        total,
        search,
        setSearch,
        setPage,
        setLimit,
        refresh,
    };
}
