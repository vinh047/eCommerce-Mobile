import { specTemplateService } from "../services/specTemplate.service";

export const specTemplateController = {
  async buildFilterPayload({ params }: { params: { categorySlug: string } }) {
    try {
      const slug = await params?.categorySlug?.trim();
      if (!slug) {
        return Response.json(
          { error: "Missing categorySlug" },
          { status: 400 }
        );
      }

      const payload = await specTemplateService.buildFilterPayload(slug);
      if (!payload) {
        return Response.json(
          { error: "Spec template not found" },
          { status: 404 }
        );
      }

      return Response.json({ data: payload }, { status: 200 });
    } catch (err) {
      console.error("buildFilterPayload error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
};
