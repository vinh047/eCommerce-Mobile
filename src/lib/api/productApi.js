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
  return await apiFetch(`/products/detail/${slug}`);
}

const productsApi = {
  getProducts: (params) =>
    apiFetch(`/products?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getProductById: (id) =>
    apiFetch(`/products/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createProduct: (data) =>
    apiFetch("/products", {
      method: "POST",
      body: data,
    }),

  updateProduct: (id, data) =>
    apiFetch(`/products/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteProduct: (id) =>
    apiFetch(`/products/${id}`, {
      method: "DELETE",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/products/bulk`, {
      method: "POST",
      body: { ids, action },
    }),

  checkSku: (sku) =>
    apiFetch(`/products/check-sku?sku=${sku}`, {
      method: "GET",
    }),
};

export default productsApi;
