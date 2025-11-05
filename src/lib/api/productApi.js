import { apiFetch } from "./utils/apiFetch";

export async function getProductsByCategory(categoryId, limit) {
  return await apiFetch(`/products/categoryId/${categoryId}?limit=${limit}`);
}

export async function getProductsByFilters(categoryId, params) {
  return await apiFetch(`/products/filters/${categoryId}?${params}`, {
    next: { revalidate: 600 },
  });
}
export async function getProductBySlug(slug) {
  return await apiFetch(`/products/detail/${slug}`)
}
