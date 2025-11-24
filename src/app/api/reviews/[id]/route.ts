import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy chi tiết 1 review
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(params.id) },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Cập nhật review (Duyệt/Ẩn hoặc Sửa nội dung)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { content, isActived } = body;

    const updatedReview = await prisma.review.update({
      where: { id: Number(params.id) },
      data: {
        content,
        isActived,
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Failed to update review", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Xóa vĩnh viễn review
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
