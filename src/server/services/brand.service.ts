import prisma from "@/lib/prisma";

export const brandService = {
  async getBrandsByCategoryId(categoryId: number) {
    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
        products: { some: { categoryId, isActive: true } },
      },
      select: { id: true, name: true, slug: true },
    });
    return brands;
  },
};
