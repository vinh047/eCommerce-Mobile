import { productController } from "@/app/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { categoryId: string } }
) {
  return productController.getByCategory(req, context);
}
