// src/lib/api/permissionsApi.js (Giả định vị trí)
import { apiFetch } from "./utils/apiFetch";

const permissionsApi = {
  // Lấy danh sách quyền hạn (có filter, search, sort, pagination)
  getPermissions: (params) =>
    apiFetch(`/permissions?${new URLSearchParams(params)}`, {
      method: "GET",
      // Có thể dùng revalidate ngắn hơn nếu dữ liệu thay đổi thường xuyên
      next: { revalidate: 3600 },
    }),

  // Lấy chi tiết quyền hạn theo id
  getPermissionById: (id) =>
    apiFetch(`/permissions/${id}`, {
      method: "GET",
    }),

  // Tạo mới quyền hạn
  createPermission: (data) =>
    apiFetch("/permissions", {
      method: "POST",
      body: data,
    }),

  // Cập nhật quyền hạn
  updatePermission: (id, data) =>
    apiFetch(`/permissions/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa quyền hạn
  deletePermission: (id) =>
    apiFetch(`/permissions/${id}`, {
      method: "DELETE",
    }),

  // Lấy tất cả ID theo bộ lọc (dùng cho “Select all” / Bulk action)
  getAllIds: (params) =>
    apiFetch(`/permissions/ids?${new URLSearchParams(params)}`, {
      method: "GET",
    }),

  // Hành động hàng loạt (ví dụ: xóa, kích hoạt, vô hiệu hóa…)
  // Đối với Permission, action chủ yếu là 'delete'
  bulkAction: (ids, action) =>
    apiFetch(`/permissions/bulk`, {
      method: "POST",
      body: { ids, action }, // action sẽ là 'delete' trong trường hợp Permission
    }),
};

export default permissionsApi;
