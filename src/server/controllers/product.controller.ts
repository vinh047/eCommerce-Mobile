import { NextRequest, NextResponse } from "next/server";
import { productService } from "../services/product.service";
import { z } from "zod";
import { categoryService } from "../services/category.service";

function searchParamsToObject(sp: URLSearchParams) {
  const o: Record<string, string> = {};
  // FE của bạn đang truyền giá trị dạng "a=1,2,3" nên 1 key chỉ có 1 value
  sp.forEach((v, k) => {
    o[k] = v;
  });
  return o;
}

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

  async getFiltersByCategory(
    req: NextRequest,
    { params }: { params: { categorySlug: string } }
  ) {
    try {
      const { categorySlug } = await params;
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

  async getProductsByFilters(
    req: NextRequest,
    context: { params: { categoryId: string } }
  ) {
    try {
      const { categoryId } = await context.params;

      // 2. Lấy tất cả searchParams và chuyển thành một object filters
      const filters = Object.fromEntries(req.nextUrl.searchParams.entries());

      // 3. Gọi đến service để xử lý logic lấy dữ liệu từ database
      // Dùng await ở đây vì đây là một tác vụ bất đồng bộ
      const products = await productService.getProductsByFilters(
        Number(categoryId),
        filters
      );

      // 4. Trả về kết quả thành công dưới dạng JSON
      return NextResponse.json(products);
    } catch (error) {
      // 5. Bắt lỗi và trả về một response lỗi tường minh
      console.error(`[API_PRODUCTS_FILTER_ERROR]`, error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  },
};
