import { categoryController } from "@/app/server/controllers/category.controller";

export async function GET() {
    return await categoryController.getAllCategories();
}