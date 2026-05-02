import { RoleGetResponse, UserGetResponse, UserPost } from "../types/users";
import { request } from "./api";

class UserService {
  async getAllUsers(): Promise<UserGetResponse[]> {
    return request<UserGetResponse[]>("/users");
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
    return request<RoleGetResponse[]>("/roles");
  }
}

export const usersService = new UserService();
