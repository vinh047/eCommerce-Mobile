import { prisma } from "@/lib/prisma";

export const categoryService = {
  async getAllCategories() {
    try {
      return await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      });
    } catch (e: any) {
      console.warn("getAllCategories fallback:", e?.message || e);
      if (e?.code === "P2021") return [];
      throw e;
    }
  },

  async getRootCategories() {
    try {
      return await prisma.category.findMany({
        where: { isActive: true, parent: null },
        orderBy: { id: "asc" },
      });
    } catch (e: any) {
      console.warn("getRootCategories fallback:", e?.message || e);
      if (e?.code === "P2021") return [];
      throw e;
    }
  },

  async getCategoryBySlug(slug: string) {
    try {
      return await prisma.category.findUnique({
        where: { slug },
      });
    } catch (e: any) {
      console.warn("getCategoryBySlug fallback:", e?.message || e);
      if (e?.code === "P2021") return null;
      throw e;
    }
  },
};
