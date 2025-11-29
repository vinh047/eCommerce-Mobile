import { apiFetch } from "./utils/apiFetch";

const ordersApi = {
  getOrders: (params) =>
    apiFetch(`/orders?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getOrderById: (id) =>
    apiFetch(`/orders/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createOrder: (data) =>
    apiFetch("/orders", {
      method: "POST",
      body: data,
    }),

  updateOrder: (id, data) =>
    apiFetch(`/orders/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteOrder: (id) =>
    apiFetch(`/orders/${id}`, {
      method: "DELETE",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/orders/bulk`, {
      method: "POST",
      body: { ids, action },
    }),

  getMyOrders: (params) =>
    apiFetch(`/orders/me?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
      credentials: "include", // QUAN TRỌNG để gửi cookie token
    }),

};

export default ordersApi;
