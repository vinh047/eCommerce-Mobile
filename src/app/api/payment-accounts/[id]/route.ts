import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updatedAccount = await prisma.paymentAccount.update({
      where: { id: Number(id) },
      data: {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        bankBranch: data.bankBranch,
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedAccount);
  } catch (err: any) {
    console.error("Error updating payment account:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.paymentAccount.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting payment account:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
