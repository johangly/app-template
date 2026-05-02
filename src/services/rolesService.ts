import { PermissionGetResponse, PermissionPost, RoleGetResponse } from "../types/users";
import { request } from "./api";

class RolesService {
  async getAllRoles(): Promise<RoleGetResponse[]> {
    return request<RoleGetResponse[]>("/roles");
  }

  async getRoleById(id: number): Promise<RoleGetResponse> {
    return request<RoleGetResponse>(`/roles/${id}`);
  }

  async createRole(data: { name: string; description: string; permissionIds?: number[] }): Promise<RoleGetResponse> {
    return request<RoleGetResponse>("/roles/create-role", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRole(id: number, data: { name: string; description: string }): Promise<RoleGetResponse> {
    return request<RoleGetResponse>(`/roles/update-role/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/roles/delete-role/${id}`, {
      method: "DELETE",
    });
  }

  async getRolePermissions(id: number): Promise<PermissionGetResponse[]> {
    return request<PermissionGetResponse[]>(`/roles/${id}/permissions`);
  }

  async updateRolePermissions(id: number, permissionIds: number[]): Promise<RoleGetResponse> {
    return request<RoleGetResponse>(`/roles/${id}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissionIds }),
    });
  }

  async getAllPermissions(): Promise<PermissionGetResponse[]> {
    return request<PermissionGetResponse[]>("/permissions");
  }

  async createPermission(data: PermissionPost): Promise<PermissionGetResponse> {
    return request<PermissionGetResponse>("/permissions/create-permission", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePermission(id: number, data: PermissionPost): Promise<PermissionGetResponse> {
    return request<PermissionGetResponse>(`/permissions/update-permission/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePermission(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/permissions/delete-permission/${id}`, {
      method: "DELETE",
    });
  }
}

export const rolesService = new RolesService();
