import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const methods = await prisma.paymentMethod.findMany({
      include: { accounts: true },
    });
    return NextResponse.json(methods, { status: 200 });
  } catch (error) {
    // Log server-side error for debugging
    console.error("GET /api/payment-methods error:", error);
    return NextResponse.json(
      { message: "Failed to load payment methods" },
      { status: 500 }
    );
  }
}
