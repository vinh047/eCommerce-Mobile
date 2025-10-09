import prisma from "@/lib/prisma";

export const categoryService = {
  async getAllCategories() {
    return await prisma.category.findMany({ where: { isActive: true } });
  },

  async getCategoryBySlug(slug: string) {
    return await prisma.category.findUnique({ where: { slug } });
  },

  async getById(id: number) {
    return await prisma.category.findUnique({ where: { id } });
  },
};
