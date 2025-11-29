import prisma from "@/lib/prisma";

export const categoryService = {
  async getAllCategories() {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });
  },

  async getRootCategories() {
    return await prisma.category.findMany({
      where: { isActive: true, parent: null },
      orderBy: { id: "asc" },
    });
  },

  async getCategoriesWithSpecTemplates() {
    return await prisma.category.findMany({
      where: { isActive: true, templates: { some: {} } },
      orderBy: { id: "asc" },
    }); 
  },

  async getCategoryBySlug(slug: string) {
    return await prisma.category.findUnique({ where: { slug } });
  },

  async getById(id: number) {
    return await prisma.category.findUnique({ where: { id } });
  },
};
