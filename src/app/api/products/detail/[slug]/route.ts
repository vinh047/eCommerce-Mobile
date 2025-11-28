import { NextRequest } from "next/server";
import { productController } from "@/server/controllers/product.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  console.log("🧩 API params:", resolvedParams);
  return productController.getBySlug(req, { params: resolvedParams });
}
