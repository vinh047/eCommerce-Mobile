import { categoryService } from "../services/category.service";

export const categoryController = {
  async getAllCategories() {
    try {
      const categories = await categoryService.getAllCategories();
      return Response.json(categories, { status: 200 });
    } catch (error) {
      console.error("getAllCategories error:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  async getCategoryBySlug({ params }: { params: { slug: string } }) {
    try {
      const { slug } = await params;
      if (!slug) {
        return Response.json(
          { error: "Missing category slug" },
          { status: 400 }
        );
      }

      const category = await categoryService.getCategoryBySlug(slug);

      if (!category) {
        return Response.json({ error: "Category not found" }, { status: 404 });
      }

      return Response.json(category, { status: 200 });
    } catch (err: any) {
      console.error("getCategoryBySlug error:", err);

      return Response.json(
        { error: "Internal Server Error", message: err.message },
        { status: 500 }
      );
    }
  },
};
