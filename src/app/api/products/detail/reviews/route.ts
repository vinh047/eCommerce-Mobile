import { NextRequest } from "next/server";
import { productController } from "@/server/controllers/product.controller";
export async function GET(req: NextRequest) {
  const offset= Number(req.nextUrl.searchParams.get("offset") || "0");
  const limit= Number(req.nextUrl.searchParams.get("limit") || "5");
  const productId=Number(req.nextUrl.searchParams.get("productId"));
  return await productController.getReviewsByProductId({offset, limit, productId});
}   