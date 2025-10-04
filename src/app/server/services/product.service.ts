import prisma from "@/lib/prisma";

export const productService = {
  async getProductsWithMinPriceByCategory(
    categoryId: string,
    limit: number = 10
  ) {
    const categoryIdNum = Number(categoryId);
    if (!Number.isFinite(categoryIdNum)) {
      throw new Error("Invalid categoryId");
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryIdNum,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
          select: {
            id: true,
            price: true,
            media: {
              where: { isPrimary: true },
              orderBy: [{ sortOrder: "asc" }],
              take: 1,
              select: { id: true, url: true, isPrimary: true },
            },
          },
        },
      },
    });

    const items = products.map((p) => {
      const cheapest = p.variants[0];
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        createdAt: p.createdAt,
        ratingAvg: p.ratingAvg,
        minPrice: cheapest?.price ?? null,
        image: cheapest?.media?.[0]?.url ?? null,
        cheapestVariantId: cheapest?.id ?? null,
      };
    });

    return items;
  },
};
