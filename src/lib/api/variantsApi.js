import { apiFetch } from "./utils/apiFetch";

const variantsApi = {
  getVariants: (params) =>
    apiFetch(`/variants?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  getVariantById: (id) =>
    apiFetch(`/variants/${id}`, {
      method: "GET",
      cache: "force-cache",
    }),

  getVariantByTemplateId: (productID) =>
    apiFetch(`/variant-spec/by-template/${productID}`, {
      method: "GET",
      cache: "force-cache",
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
      cache: "force-cache",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/variants/bulk`, {
      method: "POST",
      body: { ids, action },
    }),

  getCategoryById: (variantId) =>
    apiFetch(`/variants/category?variantId=${variantId}`, {
      method: "GET",
      cache: "force-cache",
    }),
};

export default variantsApi;
