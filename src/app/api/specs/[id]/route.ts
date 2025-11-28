import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET Detail
export async function GET(
 req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spec = await prisma.specTemplate.findUnique({
      where: { id: Number(id) },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const updated = await prisma.specTemplate.update({
      where: { id: Number(id) },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.specTemplate.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
