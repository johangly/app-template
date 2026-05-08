import { RoleGetResponse, UserGetResponse, UserPost } from "../types/users";
import { request } from "./api";

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class UserService {
  async getAllUsers(): Promise<UserGetResponse[]> {
    return request<UserGetResponse[]>("/users");
  }

  async getPaginatedUsers(params: { page: number; limit: number; search?: string }): Promise<PaginatedResponse<UserGetResponse>> {
    const query = new URLSearchParams();
    query.set("page", params.page.toString());
    query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    return request<PaginatedResponse<UserGetResponse>>(`/users?${query.toString()}`);
  }
  async getUserById(id: number): Promise<UserGetResponse> {
    return request<UserGetResponse>(`/users/${id}`);
  }
  async createUser(data: UserPost): Promise<UserGetResponse> {
    return request<UserGetResponse>("/users/create-user", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async updateUser(id: number, data: UserPost): Promise<UserGetResponse> {
    return request<UserGetResponse>(`/users/update-user/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  async getAllRoles(): Promise<RoleGetResponse[]> {
    const result = await request<PaginatedResponse<RoleGetResponse>>("/roles?limit=1000");
    return result.data;
  }
  async deleteUser(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/users/delete-user/${id}`, {
      method: "DELETE",
    });
  }
  async unlockUser(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/users/unlock-user/${id}`, {
      method: "PUT",
    });
  }
}

export const usersService = new UserService();
