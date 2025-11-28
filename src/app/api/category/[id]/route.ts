import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;
    const numericId = Number(id);
    if (data.slug) {
      const existing = await prisma.category.findFirst({
        where: { slug: data.slug, NOT: { id: numericId } },
      });
      if (existing)
        return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });
    }

    const parentId = data.parentId ? Number(data.parentId) : null;
    if (parentId === numericId) {
      return NextResponse.json(
        { error: "Danh mục không thể là cha của chính nó" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id: numericId },
      data: {
        name: data.name,
        slug: data.slug,
        iconKey: data.iconKey,
        isActive: data.isActive,
        parentId: parentId,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    const category = await prisma.category.findUnique({
      where: { id: numericId },
      include: { _count: { select: { products: true } } },
    });

    if (category && category._count.products > 0) {
      return NextResponse.json(
        { error: "Không thể xóa danh mục đang chứa sản phẩm." },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
