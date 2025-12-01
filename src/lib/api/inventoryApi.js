import { apiFetch } from "./utils/apiFetch";

const inventoryApi = {
  getTransactions: (params) =>
    apiFetch(`/inventory/transactions?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getTransactionById: (id) =>
    apiFetch(`/inventory/transactions/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createTransaction: (data) =>
    apiFetch("/inventory/transactions", {
      method: "POST",
      body: data,
    }),

  getDevices: (params) =>
    apiFetch(`/inventory/devices?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),
};

export default inventoryApi;
