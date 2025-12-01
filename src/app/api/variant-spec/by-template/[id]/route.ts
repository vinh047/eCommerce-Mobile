import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure this path is correct

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Find the product and "deep fetch" the related category -> template -> specs
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }, // Change to String(id) if your IDs are strings
      include: {
        category: {
          include: {
            templates: {
              include: {
                variantSpecs: true, // This gets the actual specs list
              },
            },
          },
        },
      },
    });

    // 2. Handle cases where the product or its relationships are missing
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if the product has a category and if that category has a template assigned
    if (!product.category?.templates) {
      return NextResponse.json(
        {
          error: "No specification template found for this product's category",
        },
        { status: 404 }
      );
    }

    // 3. Return only the Variant Specs part of the data
    return NextResponse.json(product.category.templates[0].variantSpecs);
  } catch (error: any) {
    console.error("Error fetching variant specs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
