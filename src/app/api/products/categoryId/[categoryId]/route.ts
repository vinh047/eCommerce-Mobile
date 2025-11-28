import { productController } from "@/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {params}: { params: Promise<{ categoryId: string }> }
) {
  const resolvedParams = await params;
  return productController.getByCategory(req, {params: resolvedParams});
}
