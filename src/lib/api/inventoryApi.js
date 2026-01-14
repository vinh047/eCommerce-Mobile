import { apiFetch } from "./utils/apiFetch";

const inventoryApi = {
  getTransactions: (params) =>
    apiFetch(`/inventory/transactions?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  getTransactionById: (id) =>
    apiFetch(`/inventory/transactions/${id}`, {
      method: "GET",
      cache: "force-cache",
    }),

  createTransaction: (data) =>
    apiFetch("/inventory/transactions", {
      method: "POST",
      body: data,
    }),

  getDevices: (params) =>
    apiFetch(`/inventory/devices?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),
};

export default inventoryApi;
