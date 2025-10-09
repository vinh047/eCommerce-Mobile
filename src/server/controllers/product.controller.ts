import { NextRequest, NextResponse } from "next/server";
import { productService } from "../services/product.service";
import { z } from "zod";
import { categoryService } from "../services/category.service";


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
      const { categoryId } = await params;
      const parseResult = getByCategorySchema.safeParse({
        categoryId,
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

  async getFiltersByCategory(req: NextRequest, {params} : {params: {categorySlug: string}}) {
    try {
      const { categorySlug } = await params
      const category = await categoryService.getCategoryBySlug(categorySlug);
      const categoryId = Number(category?.id);
      if (!Number.isFinite(categoryId))
        return NextResponse.json(
          { error: "Invalid categoryId" },
          { status: 400 }
        );

      const data = await productService.getFiltersByCategory(categoryId);
      return NextResponse.json({ data });
    } catch (e: any) {
      console.error("filters error:", e);
      return NextResponse.json(
        { error: e.message ?? "Internal Server Error" },
        { status: 500 }
      );
    }
  },
};
