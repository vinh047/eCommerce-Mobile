import { apiFetch } from "./utils/apiFetch";

/**
 * Gọi API Route để lấy template filter cho một category.
 */
export async function fetchFilterTemplate(categoryId) {
  return await apiFetch(`/filters/category/${categoryId}`, {cache:'force-cache'})
}

/**
 * Giả lập fetch options động.
 */
export async function fetchFilterOptionsFake(categoryId, fields) {
  await new Promise((r) => setTimeout(r, 30));
  const out = {};
  for (const f of fields) out[f] = [];
  return out;
}
