import { apiFetch } from "./utils/apiFetch";

const specsApi = {
  getSpecs: (params) =>
    apiFetch(`/specs?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  getSpecById: (id) =>
    apiFetch(`/specs/${id}`, { method: "GET", cache: "force-cache" }),

  getTemplateByCategoryId: (categoryId) =>
    apiFetch(`/specs/by-category/${categoryId}`, {
      method: "GET",
      cache: "force-cache",
    }),

  createSpec: (data) => apiFetch("/specs", { method: "POST", body: data }),

  updateSpec: (id, data) =>
    apiFetch(`/specs/${id}`, { method: "PUT", body: data }),

  updateSpecConfig: (id, specsList) =>
    apiFetch(`/specs/${id}/config`, {
      method: "PUT",
      body: JSON.stringify(specsList),
    }),

  deleteSpec: (id) => apiFetch(`/specs/${id}`, { method: "DELETE" }),

  bulkAction: (ids, action) =>
    apiFetch(`/specs/bulk`, { method: "POST", body: { ids, action } }),
};

export default specsApi;
