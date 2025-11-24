import { apiFetch } from "./utils/apiFetch";

export async function getPaymentMethod() {
  return await apiFetch(`/paymentMethod`, { method: "GET" });
}
