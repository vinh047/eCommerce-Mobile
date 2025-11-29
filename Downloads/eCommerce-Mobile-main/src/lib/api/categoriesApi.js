import { apiFetch } from "./utils/apiFetch";

export async function getCategories() {
  return await apiFetch("/categories", { cache: "no-store" });
}
export async function getRootCategories() {
  return await apiFetch("/categories/rootCategories", { cache: "no-store" });
}

export async function getCategoriesWithSpecTemplates() {
  return await apiFetch("/categories/withSpecTemplate", { cache: "no-store" });
}

export async function getCategoryBySlug(slug) {
  return await apiFetch(`/categories/slug/${slug}`, { cache: "no-store" });
}
