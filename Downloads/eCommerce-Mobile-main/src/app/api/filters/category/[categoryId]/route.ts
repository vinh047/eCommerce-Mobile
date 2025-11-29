import { NextRequest } from "next/server";
import { specTemplateController } from "@/server/controllers/specTenplate.controller"; // Điều chỉnh đường dẫn

export async function GET(
  request: NextRequest,
  context: { params: { categoryId: string } }
) {
  return specTemplateController.getFiltersByCategoryId(request, context);
}
