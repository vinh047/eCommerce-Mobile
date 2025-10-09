import { NextResponse } from "next/server";
import { brandService } from "../services/brand.service";

export const brandController = {
  async getBrandsByCategory({ params }: { params: { categoryId: string } }) {
    try {
      const categoryId = await Number(params.categoryId);
      if (!Number.isFinite(categoryId)) {
        return NextResponse.json(
          { error: "Invalid categoryId" },
          { status: 400 }
        );
      }

      const brands = await brandService.getBrandsByCategory(categoryId);

      return NextResponse.json({ data: brands });
    } catch (error) {
      console.error("getBrandsByCategory error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  },
};
