import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Tạo tài khoản ngân hàng mới cho 1 phương thức cụ thể
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const paymentMethodId = resolvedParams.id;
    const data = await req.json();

    const newAccount = await prisma.paymentAccount.create({
      data: {
        paymentMethodId: Number(paymentMethodId),
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        bankBranch: data.bankBranch,
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (err: any) {
    console.error("Error creating payment account:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}