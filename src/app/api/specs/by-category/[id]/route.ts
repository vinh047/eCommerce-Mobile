import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (!categoryId) {
      return NextResponse.json(
        { error: "Invalid Category ID" },
        { status: 400 }
      );
    }

    const template = await prisma.specTemplate.findFirst({
      where: {
        categoryId: categoryId,
        isActive: true,
      },
      include: {
        productSpecs: {
          orderBy: { displayOrder: "asc" },
          include: {
            options: { orderBy: { sortOrder: "asc" } },
            buckets: { orderBy: { sortOrder: "asc" } },
          },
        },

        variantSpecs: {
          orderBy: { displayOrder: "asc" },
          include: {
            options: { orderBy: { sortOrder: "asc" } },
            buckets: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: template });
  } catch (error: any) {
    console.error("Get Template By Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
