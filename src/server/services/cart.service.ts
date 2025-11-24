import prisma from "@/lib/prisma";

export const cartService = {
  async getCartByUserId(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { id: "desc" },
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true } },
                MediaVariant: {
                  take: 1,
                  orderBy: { Media: { sortOrder: "asc" } },
                  select: { Media: { select: { url: true } } },
                },
                variantSpecValues: {
                  select: {
                    unit: true,
                    type: true,
                    stringValue: true,
                    numericValue: true,
                    booleanValue: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    const formattedItems = cart.items.map((item) => {
      const variant = item.variant;
      const product = variant.product;
      const imageUrl = variant.MediaVariant[0]?.Media?.url || null;

      // ✅ Lấy các thông số có giá trị, không cần label
      const specs = variant.variantSpecValues
        .filter(
          (spec) =>
            spec.stringValue !== null ||
            spec.numericValue !== null ||
            spec.booleanValue !== null
        )
        .map((spec) => {
          let value: string;

          if (spec.stringValue !== null) value = spec.stringValue;
          else if (spec.numericValue !== null)
            value = spec.numericValue.toString();
          else value = spec.booleanValue ? "Có" : "Không";

          return spec.unit ? `${value} ${spec.unit}` : value;
        });

      return {
        id: item.id,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        variantName: variant.color,
        price: Number(variant.price),
        quantity: item.quantity,
        image: imageUrl,
        maxStock: variant.stock,
        specs, // ✅ specs là mảng string
      };
    });

    return {
      ...cart,
      items: formattedItems,
    };
  },
};
