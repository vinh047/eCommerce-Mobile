import { apiFetch } from "./utils/apiFetch";

const paymentApi = {
  getMethods: (params) =>
    apiFetch(`/payment-methods?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  createMethod: (data) =>
    apiFetch("/payment-methods", {
      method: "POST",
      body: data,
    }),

  updateMethod: (id, data) =>
    apiFetch(`/payment-methods/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteMethod: (id) =>
    apiFetch(`/payment-methods/${id}`, {
      method: "DELETE",
    }),

  createAccount: (methodId, data) =>
    apiFetch(`/payment-methods/${methodId}/accounts`, {
      method: "POST",
      body: data,
    }),

  updateAccount: (accountId, data) =>
    apiFetch(`/payment-accounts/${accountId}`, {
      method: "PUT",
      body: data,
    }),

  deleteAccount: (accountId) =>
    apiFetch(`/payment-accounts/${accountId}`, {
      method: "DELETE",
    }),
};

export default paymentApi;
