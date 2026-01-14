import { apiFetch } from "./utils/apiFetch";

const rolesApi = {
  // Lấy danh sách roles (kèm phân trang, search)
  getRoles: (params) =>
    apiFetch(`/roles?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  // Lấy chi tiết 1 role (để xem hoặc edit)
  getRoleById: (id) =>
    apiFetch(`/roles/${id}`, {
      method: "GET",
      cache: "force-cache",
    }),

  // Tạo role mới (Payload gồm: name, permissionIds[])
  createRole: (data) =>
    apiFetch("/roles", {
      method: "POST",
      body: data,
    }),

  // Cập nhật role (Payload gồm: name, permissionIds[])
  updateRole: (id, data) =>
    apiFetch(`/roles/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa role
  deleteRole: (id) =>
    apiFetch(`/roles/${id}`, {
      method: "DELETE",
    }),

  // Lấy tất cả IDs (dùng cho tính năng Select All để xóa hàng loạt)
  getAllIds: (params) =>
    apiFetch(`/roles/ids?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  // Xóa hàng loạt
  bulkAction: (ids, action) =>
    apiFetch(`/roles/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default rolesApi;
