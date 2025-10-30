import { categoryController } from "@/server/controllers/category.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  return await categoryController.getCategoryBySlug({ params });
}
