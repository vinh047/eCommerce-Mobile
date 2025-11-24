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