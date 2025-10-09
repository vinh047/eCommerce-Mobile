import { productController } from "@/server/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {params}: { params: { categorySlug: string } }
) {
    
    return await productController.getFiltersByCategory(req, {params});
}
