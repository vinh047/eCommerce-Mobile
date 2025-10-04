import { categoryService } from "../services/category.service";

export const categoryController = {
  async getAllCategories() {
    try {
      const categories = await categoryService.getAllCategories();
      return Response.json({ data: categories }, { status: 200 });
    } catch (error) {
      console.error("getAllCategories error:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
};
