import { apiFetch } from "./utils/apiFetch";

const rmasApi = {
  getRmas: (params) =>
    apiFetch(`/rmas?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  getRmaById: (id) =>
    apiFetch(`/rmas/${id}`, {
      method: "GET",
      cache: "force-cache",
    }),

  createRma: (data) =>
    apiFetch(`/rmas`, {
      method: "POST",
      body: data,
    }),

  updateRma: (id, data) =>
    apiFetch(`/rmas/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteRma: (id) =>
    apiFetch(`/rmas/${id}`, {
      method: "DELETE",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/rmas/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default rmasApi;
