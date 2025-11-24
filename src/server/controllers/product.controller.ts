import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { productService } from "../services/product.service";

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

      const products = await productService.getProductsWithMinPriceByCategory(
        parseResult.data.categoryId,
        limit
      );

      return Response.json(products);
    } catch (err: any) {
      console.error("getByCategory error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
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

  async getBySlug(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
      const { slug } = params;

      if (!slug) {
        return Response.json({ error: "Missing slug" }, { status: 400 });
      }

      const product = await productService.getProductBySlug(slug);

      if (!product) {
        return Response.json({ error: "Product not found" }, { status: 404 });
      }

      return Response.json(product, { status: 200 });
    } catch (err: any) {
      console.error("getBySlug error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  async getReviewsByProductId(
    { offset, limit, productId }: { offset: number; limit: number; productId: number }
  ) {
    try {

      const reviews = await productService.getReviewsByProductId(productId,offset, limit);
      return Response.json(reviews, { status: 200 });
    } catch (err: any) {
      console.error("getReviews error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  async getRelatedProduct(productId:number){
    try {

      const product = await productService.findSimilarProductsById(productId);
      return Response.json(product, { status: 200 });
    } catch (err: any) {
      console.error("get Product error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
};
