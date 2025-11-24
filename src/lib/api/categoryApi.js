import { apiFetch } from "./utils/apiFetch";

const categoryApi = {
  getCategories: (params) =>
    apiFetch(`/category?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getCategoryById: (id) =>
    apiFetch(`/category/${id}`, { method: "GET", cache: "no-store" }),

  createCategory: (data) =>
    apiFetch("/category", { method: "POST", body: data }),

  updateCategory: (id, data) =>
    apiFetch(`/category/${id}`, { method: "PUT", body: data }),

  deleteCategory: (id) => apiFetch(`/category/${id}`, { method: "DELETE" }),

  bulkAction: (ids, action) =>
    apiFetch(`/category/bulk`, { method: "POST", body: { ids, action } }),
};

export default categoryApi;
