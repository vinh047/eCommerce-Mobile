import { apiFetch } from "./utils/apiFetch";

const brandsApi = {
  getBrands: (params) =>
    apiFetch(`/brands?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getBrandById: (id) =>
    apiFetch(`/brands/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createBrand: (data) =>
    apiFetch("/brands", {
      method: "POST",
      body: data,
    }),

  updateBrand: (id, data) =>
    apiFetch(`/brands/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteBrand: (id) =>
    apiFetch(`/brands/${id}`, {
      method: "DELETE",
    }),

  getAllIds: (params) =>
    apiFetch(`/brands/ids?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/brands/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default brandsApi;
