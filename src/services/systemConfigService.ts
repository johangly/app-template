import { request } from "./api";

export interface SystemConfigItem {
    id: string;
    key: string;
    value: string;
    type: string;
    description: string | null;
}

class SystemConfigService {
    async getAll(): Promise<SystemConfigItem[]> {
        return request<SystemConfigItem[]>("/system-config");
    }

    async update(configs: { key: string; value: string | boolean | number }[]): Promise<SystemConfigItem[]> {
        return request<SystemConfigItem[]>("/system-config", {
            method: "PUT",
            body: JSON.stringify({ configs }),
        });
    }

    async getPublic(): Promise<Record<string, string>> {
        return request<Record<string, string>>("/system-config/public");
    }
}

export const systemConfigService = new SystemConfigService();
