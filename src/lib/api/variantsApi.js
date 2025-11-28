import { apiFetch } from "./utils/apiFetch";

const variantsApi = {
  getVariants: (params) =>
    apiFetch(`/variants?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getVariantById: (id) =>
    apiFetch(`/variants/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createVariant: (data) =>
    apiFetch("/variants", {
      method: "POST",
      body: data,
    }),

  updateVariant: (id, data) =>
    apiFetch(`/variants/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteVariant: (id) =>
    apiFetch(`/variants/${id}`, {
      method: "DELETE",
    }),

  getAllIds: (params) =>
    apiFetch(`/variants/ids?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/variants/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default variantsApi;