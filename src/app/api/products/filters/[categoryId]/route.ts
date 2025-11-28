import { productController } from "@/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  const resolvedParams = await context.params;
  return await productController.getProductsByFilters(req, { params: resolvedParams });
}
