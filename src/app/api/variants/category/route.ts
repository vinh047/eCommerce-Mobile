import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const variantId = Number(searchParams.get("variantId"));

    if (!variantId || isNaN(variantId)) {
      return NextResponse.json(
        { error: "variantId is required" },
        { status: 400 }
      );
    }

    // 1. Lấy variant → productId
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      select: { productId: true },
    });

    if (!variant) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    // 2. Lấy product → categoryId
    const product = await prisma.product.findUnique({
      where: { id: variant.productId },
      select: { categoryId: true },
    });

    if (!product || !product.categoryId) {
      return NextResponse.json(
        { error: "Category not found for this variant" },
        { status: 404 }
      );
    }

    const categoryId = product.categoryId;

    // 3. (OPTIONAL) Lấy template theo categoryId
    // nếu bạn muốn trả luôn template.variantSpecs:
    const template = await prisma.specTemplate.findFirst({
      where: { categoryId },
      include: {
        variantSpecs: {
          include: { options: true, buckets: true },
        },
      },
    });

    return NextResponse.json({
      variantId,
      productId: variant.productId,
      categoryId,
      template, // Nếu không cần thì xoá dòng này
    });
  } catch (err) {
    console.error("Error fetching category by variant:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
