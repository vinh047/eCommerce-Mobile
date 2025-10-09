import { specTemplateController } from "@/server/controllers/specTenplate.controller";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { categorySlug: string } }
) {
  console.log({ params });
  return specTemplateController.buildFilterPayload({ params });
}
