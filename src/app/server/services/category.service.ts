import prisma from "@/lib/prisma";

export const categoryService = {
  async getAllCategories() {
    return await prisma.category.findMany({ where: { isActive: true } });
  },
};
