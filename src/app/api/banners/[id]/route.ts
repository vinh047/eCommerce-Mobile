import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET Single Banner
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id: Number(id) },
      include: {
        product: { select: { id: true, name: true } },
      },
    });

    if (!banner || banner.isDeleted) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT Update Banner
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { image, altText, isActive, displayOrder, productId } = body;
    const { id } = await params;

    const updatedBanner = await prisma.banner.update({
      where: { id: Number(id) },
      data: {
        image,
        altText,
        isActive,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        productId: productId !== undefined ? parseInt(productId) : undefined,
      },
      include: { product: { select: { id: true, name: true } } },
    });

    return NextResponse.json(updatedBanner);
  } catch (error: any) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { message: "Failed to update banner", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE Banner (Soft Delete hoặc Hard Delete tùy nhu cầu)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    // Cách 1: Xóa cứng (Hard delete)
    // await prisma.banner.delete({ where: { id: numericId } });
    
    // Cách 2: Xóa mềm (Soft delete - Recommended theo schema của bạn)
    await prisma.banner.update({
        where: { id: numericId },
        data: { isDeleted: true }
    });

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}