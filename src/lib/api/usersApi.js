import { apiFetch } from "./utils/apiFetch";

const usersApi = {
  // Lấy danh sách users
  getUsers: (params) =>
    apiFetch(`/users?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  // Lấy chi tiết user
  getUserById: (id) =>
    apiFetch(`/users/${id}`, {
      method: "GET",
      cache: "force-cache",
    }),

  createUser: (data) =>
    apiFetch("/users", {
      method: "POST",
      body: data,
    }),

  updateUser: (id, data) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteUser: (id) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
    }),

  getAllIds: (params) =>
    apiFetch(`/users/ids?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/users/bulk`, {
      method: "POST",
      body: { ids, action },
    }),

  getCurrentUser: () => 
    apiFetch('/users/current', {
      method: "GET",
      credentials: "include", 
    })
};

export default usersApi;
