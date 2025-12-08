import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =========================
//  PUT /api/reviews/:id
// =========================
export async function PUT(req: Request, { params }: any) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    const { stars, content } = body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        stars: stars ? Number(stars) : undefined,
        content: content ?? undefined,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật review: " + err.message },
      { status: 500 }
    );
  }
}

// =========================
//  DELETE /api/reviews/:id
// =========================
export async function DELETE(req: Request, { params }: any) {
  try {
    const id = Number(params.id);

    // Xóa review
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Lỗi khi xóa review: " + err.message },
      { status: 500 }
    );
  }
}
