import { apiFetch } from "./utils/apiFetch";

// Lấy giỏ hàng của user hiện tại
export async function getCart() {
  return await apiFetch(`/cart`);
}

export async function removeItem(itemId) {
  return await apiFetch(`/cart`, {
    method: "DELETE",
    body: JSON.stringify({ id: itemId }),
  });
}

export async function updateItemQuantity(itemId, quantity) {
  return await apiFetch(`/cart`, {
    method: "PUT",
    body: JSON.stringify({ id: itemId, quantity }),
  });
}
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
