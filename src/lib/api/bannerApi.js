// src/lib/api/bannerApi.js (ví dụ path)
import { apiFetch } from "./utils/apiFetch";

// Lấy danh sách banner
export async function getBanners() {
  return await apiFetch(`/banners`);
}

const bannersApi = {
  getBanners: (params) =>
    apiFetch(`/banners?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getBannerById: (id) =>
    apiFetch(`/banners/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createBanner: (data) =>
    apiFetch("/banners", {
      method: "POST",
      body: data,
    }),

  updateBanner: (id, data) =>
    apiFetch(`/banners/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteBanner: (id) =>
    apiFetch(`/banners/${id}`, {
      method: "DELETE",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/banners/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default bannersApi;
