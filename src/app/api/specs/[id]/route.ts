import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET Detail
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const spec = await prisma.specTemplate.findUnique({
      where: { id: Number(params.id) },
      include: {
        category: true,
        productSpecs: {
          orderBy: { displayOrder: "asc" },
          include: { options: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!spec)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(spec);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT (Update Meta info only)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updated = await prisma.specTemplate.update({
      where: { id: Number(params.id) },
      data: {
        name: data.name,
        categoryId: Number(data.categoryId),
        isActive: data.isActive,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.specTemplate.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
