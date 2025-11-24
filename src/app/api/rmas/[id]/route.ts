import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rma = await prisma.rma.findUnique({
      where: { id: Number(params.id) },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, adminNote } = body;

    const updatedRma = await prisma.rma.update({
      where: { id: Number(params.id) },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.rma.delete({ where: { id } });
    return NextResponse.json({ message: "RMA deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
