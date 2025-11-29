import { productController } from "@/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { categoryId: string } }
) {
  return await productController.getProductsByFilters(req, context);
}
