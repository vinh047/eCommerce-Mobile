// src/lib/api/bannerApi.js (ví dụ path)
import { apiFetch } from "./utils/apiFetch";

// Lấy danh sách banner
export async function getBanners() {
  return await apiFetch(`/banners`);
}