import { apiFetch } from "./utils/apiFetch";

const usersApi = {
  // Lấy danh sách users
  getUsers: (params) =>
    apiFetch(`/users?${new URLSearchParams(params)}`, {
      method: "GET",
      next: { revalidate: 60 },
    }),

  // Lấy chi tiết user
  getUserById: (id) =>
    apiFetch(`/users/${id}`, {
      method: "GET",
    }),

  // Tạo user
  createUser: (data) =>
    apiFetch("/users", {
      method: "POST",
      body: data,
    }),

  // Cập nhật user
  updateUser: (id, data) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa user
  deleteUser: (id) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
    }),

  // Lấy tất cả id theo filter
  getAllIds: (params) =>
    apiFetch(`/users/ids?${new URLSearchParams(params)}`, {
      method: "GET",
    }),

  // Hành động hàng loạt
  bulkAction: (ids, action) =>
    apiFetch(`/users/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default usersApi;
