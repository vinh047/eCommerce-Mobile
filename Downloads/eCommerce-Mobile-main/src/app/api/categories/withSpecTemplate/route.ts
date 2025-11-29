import { categoryController } from "@/server/controllers/category.controller";

export async function GET() {
    return await categoryController.getCategoriesWithSpecTemplates();
}