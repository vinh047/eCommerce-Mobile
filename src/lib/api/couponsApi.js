import { apiFetch } from "./utils/apiFetch";

const couponsApi = {
  // Lấy danh sách coupon (có filter, search, sort, pagination)
  getCoupons: (params) =>
    apiFetch(`/coupons?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache"
    }),

  // Lấy chi tiết coupon theo id
  getCouponById: (id) =>
    apiFetch(`/coupons/${id}`, {
      method: "GET",
    }),

  // Tạo mới coupon
  createCoupon: (data) =>
    apiFetch("/coupons", {
      method: "POST",
      body: data,
    }),

  // Cập nhật coupon
  updateCoupon: (id, data) =>
    apiFetch(`/coupons/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa coupon
  deleteCoupon: (id) =>
    apiFetch(`/coupons/${id}`, {
      method: "DELETE",
    }),

  // Lấy tất cả ID theo bộ lọc (dùng cho “Select all” / Bulk action)
  getAllIds: (params) =>
    apiFetch(`/coupons/ids?${new URLSearchParams(params)}`, {
      method: "GET",
    }),

  // Hành động hàng loạt (ví dụ: xóa, kích hoạt, vô hiệu hóa…)
  bulkAction: (ids, action) =>
    apiFetch(`/coupons/bulk`, {
      method: "POST",
      body: { ids, action },
    }),

  applyBestCoupon: (data) =>
    apiFetch(`/coupons/apply-best`, {
      method: "POST",
      body: data,
    }),
};

export default couponsApi;
