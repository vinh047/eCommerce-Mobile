import { productController } from "@/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {params}: { params: { categoryId: string } }
) {
  return productController.getByCategory(req, {params});
}
