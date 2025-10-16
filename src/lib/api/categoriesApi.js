import { apiFetch } from "./utils/apiFetch";

export async function getCategories() {
  return await apiFetch("/categories", { cache: "force-cache" });
}

export async function getCategoryBySlug(slug) {
  return await apiFetch(`/categories/slug/${slug}`, { cache: "force-cache" });
}
