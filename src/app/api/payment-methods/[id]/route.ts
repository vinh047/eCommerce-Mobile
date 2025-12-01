import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Cập nhật phương thức
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updatedMethod = await prisma.paymentMethod.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        // code: data.code, // Code thường fix cứng, ko cho sửa
        description: data.description,
        logoUrl: data.logoUrl,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
      },
      include: { accounts: true },
    });

    return NextResponse.json(updatedMethod);
  } catch (err: any) {
    console.error("Error updating payment method:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Xóa phương thức
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.paymentMethod.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Payment method deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting payment method:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}