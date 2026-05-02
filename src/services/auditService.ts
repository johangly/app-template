import { request } from "./api";

export interface AuditLogResponse {
    id: string;
    userId: string | null;
    userEmail: string | null;
    action: string;
    resource: string;
    resourceId: string | null;
    description: string | null;
    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
}

export interface AuditConfigResponse {
    id: string;
    resource: string;
    action: string;
    enabled: boolean;
}

export interface PaginatedAuditLogs {
    data: AuditLogResponse[];
    total: number;
    page: number;
    totalPages: number;
}

class AuditService {
    async getLogs(params: {
        page?: number;
        limit?: number;
        resource?: string;
        action?: string;
        userId?: number;
        from?: string;
        to?: string;
        search?: string;
    }): Promise<PaginatedAuditLogs> {
        const query = new URLSearchParams();
        if (params.page) query.set("page", params.page.toString());
        if (params.limit) query.set("limit", params.limit.toString());
        if (params.resource) query.set("resource", params.resource);
        if (params.action) query.set("action", params.action);
        if (params.userId) query.set("userId", params.userId.toString());
        if (params.from) query.set("from", params.from);
        if (params.to) query.set("to", params.to);
        if (params.search) query.set("search", params.search);
        return request<PaginatedAuditLogs>(`/audit-logs?${query.toString()}`);
    }

    async getLogById(id: number): Promise<AuditLogResponse> {
        return request<AuditLogResponse>(`/audit-logs/${id}`);
    }

    async cleanupLogs(days: number): Promise<{ message: string }> {
        return request<{ message: string }>(`/audit-logs/cleanup?days=${days}`, {
            method: "DELETE",
        });
    }

    async getConfig(): Promise<AuditConfigResponse[]> {
        return request<AuditConfigResponse[]>("/audit-config");
    }

    async updateConfig(configs: { id: number; enabled: boolean }[]): Promise<AuditConfigResponse[]> {
        return request<AuditConfigResponse[]>("/audit-config", {
            method: "PUT",
            body: JSON.stringify({ configs }),
        });
    }
}

export const auditService = new AuditService();
