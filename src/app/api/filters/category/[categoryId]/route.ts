import { NextRequest } from "next/server";
import { specTemplateController } from "@/server/controllers/specTenplate.controller"; // Điều chỉnh đường dẫn

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  const resolvedParams = await context.params;
  return specTemplateController.getFiltersByCategoryId(request, {
    params: resolvedParams,
  });
}
