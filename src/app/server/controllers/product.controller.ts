import { NextRequest } from "next/server";
import { productService } from "../services/product.service";
import { z } from "zod";

const getByCategorySchema = z.object({
  categoryId: z.string().regex(/^\d+$/),
  limit: z.string().optional(),
});

export const productController = {
  async getByCategory(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      // Validate param + query
      const sp = req.nextUrl.searchParams;
      const parseResult = getByCategorySchema.safeParse({
        categoryId: params.categoryId,
        limit: sp.get("limit") ?? undefined,
      });

      if (!parseResult.success) {
        return Response.json({ error: "Invalid input" }, { status: 400 });
      }

      const limit = Math.min(
        100,
        Math.max(1, Number(parseResult.data.limit ?? 10))
      );

      const items = await productService.getProductsWithMinPriceByCategory(
        parseResult.data.categoryId,
        limit
      );

      return Response.json({ data: { items, total: items.length, limit } });
    } catch (err: any) {
      console.error("getByCategory error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
};
