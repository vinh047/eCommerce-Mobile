import { NextRequest } from "next/server";
import { productController } from "@/server/controllers/product.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log("🧩 API params:", params);
  return productController.getBySlug(req, { params });
}
