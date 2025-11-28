import { categoryController } from "@/server/controllers/category.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  return await categoryController.getCategoryBySlug({ params: resolvedParams });
}
