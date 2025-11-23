import { apiFetch } from "./utils/apiFetch";

const cartsApi = {
  getCarts: (params) =>
    apiFetch(`/carts?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getCartById: (id) =>
    apiFetch(`/carts/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  deleteCart: (id) =>
    apiFetch(`/carts/${id}`, {
      method: "DELETE",
    }),

  getAllIds: (params) =>
    apiFetch(`/carts/ids?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/carts/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default cartsApi;
