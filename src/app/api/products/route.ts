import { productController } from "@/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return productController.list(req);
}
