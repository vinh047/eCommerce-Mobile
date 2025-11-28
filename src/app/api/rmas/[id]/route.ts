import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rma = await prisma.rma.findUnique({
      where: { id: Number(id) },
      include: {
        order: {
          select: {
            id: true,
            code: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
          },
        },
        orderItem: true,
      },
    });

    if (!rma) {
      return NextResponse.json({ error: "RMA not found" }, { status: 404 });
    }

    return NextResponse.json(rma);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNote } = body;

    const updatedRma = await prisma.rma.update({
      where: { id: Number(id) },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedRma);
  } catch (error: any) {
    console.error("Error updating RMA:", error);
    return NextResponse.json(
      { message: "Failed to update RMA", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    await prisma.rma.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "RMA deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
