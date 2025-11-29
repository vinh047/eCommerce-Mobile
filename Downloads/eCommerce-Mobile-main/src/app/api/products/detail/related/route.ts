import { NextRequest } from "next/server";
import { productController } from "@/server/controllers/product.controller";
export async function GET(req: NextRequest) {
  const productId=Number(req.nextUrl.searchParams.get("productId"));
  return await productController.getRelatedProduct(productId);
}   