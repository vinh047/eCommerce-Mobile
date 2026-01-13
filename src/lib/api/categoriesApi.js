import { apiFetch } from "./utils/apiFetch";

export async function getCategories() {
  return await apiFetch("/categories", { cache: "force-cache" });
}
export async function getRootCategories() {
  return await apiFetch("/categories/rootCategories", { cache: "force-cache" });
}

export async function getCategoriesWithSpecTemplates() {
  return await apiFetch("/categories/withSpecTemplate", {
    cache: "force-cache",
  });
}

export async function getCategoryBySlug(slug) {
  return await apiFetch(`/categories/slug/${slug}`, { cache: "force-cache" });
}
