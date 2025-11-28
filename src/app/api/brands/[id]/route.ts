import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lấy chi tiết 1 brand
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id: Number(id) },
      include: {
        _count: { select: { products: true, coupons: true } },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Cập nhật brand
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;

    if (data.slug) {
      const existing = await prisma.brand.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: Number(id) },
        },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });
      }
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update brand", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Xóa brand
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { products: true } } },
    });

    if (brand && brand._count.products > 0) {
      return NextResponse.json(
        { error: "Không thể xóa thương hiệu đang chứa sản phẩm." },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "Không thể xóa do dữ liệu liên quan." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
