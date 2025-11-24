import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // nếu cần lưu

function formatDateForCode(d: Date) {
  // YYYYMMDDHHMMSS
  const z = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}${z(
    d.getHours()
  )}${z(d.getMinutes())}${z(d.getSeconds())}`;
}

function randomSuffix(len = 4) {
  return Math.floor(Math.random() * Math.pow(10, len))
    .toString()
    .padStart(len, "0");
}

async function generateUniqueOrderCode(prefix = "ORD", maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = `${prefix}-${formatDateForCode(new Date())}-${randomSuffix(
      4
    )}`;
    // kiểm tra tồn tại trong DB
    const exists = await prisma.order.findUnique({ where: { code } });
    if (!exists) return code;
    // nếu trùng, chờ 1ms và thử lại (very unlikely)
    await new Promise((res) => setTimeout(res, 1));
  }
  // fallback: uuid-like short
  return `${prefix}${Date.now()}${randomSuffix(6)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, accountNumber } = body;
    if (!amount || !accountNumber) {
      return NextResponse.json(
        { message: "Missing amount or accountNumber" },
        { status: 400 }
      );
    }

    const orderCode = await generateUniqueOrderCode("ORD", 8);

    const amountValue = String(Math.round(Number(amount)));
    const addInfo = encodeURIComponent(orderCode);
    const accountNumberSafe = String(accountNumber).replace(/\s+/g, "");
    const qrUrl = `https://img.vietqr.io/image/tcb-${accountNumberSafe}-compact2.jpg?amount=${encodeURIComponent(
      amountValue
    )}&addInfo=${addInfo}`;

    return NextResponse.json({ qrUrl, orderCode });
  } catch (err) {
    console.error("POST /api/payments/vietqr error:", err);
    return NextResponse.json(
      { message: "Failed to create VietQR" },
      { status: 500 }
    );
  }
}
