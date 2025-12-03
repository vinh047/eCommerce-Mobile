import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Map tên ngân hàng -> bankCode VietQR
const BANK_CODE_MAP: Record<string, string> = {
  techcombank: "tcb",
  vietcombank: "vcb",
  "mb bank": "mbbank",
  vpbank: "vpbank",
  agribank: "agribank",
  bidv: "bidv",
  vietinbank: "vietinbank",
  acb: "acb",
  shb: "shb",
  tpbank: "tpbank",
  ocb: "ocb",
  scb: "scb",
  sacombank: "sacombank",
};

function formatDateForCode(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function randomSuffix(len = 4) {
  return Math.floor(Math.random() * Math.pow(10, len))
    .toString()
    .padStart(len, "0");
}

async function generateUniqueOrderCode(prefix = "ORD") {
  const code = `${prefix}-${formatDateForCode(new Date())}-${randomSuffix(4)}`;
  return code;
}

export async function POST(req: Request) {
  try {
    const { amount, accountNumber } = await req.json();

    if (!amount || !accountNumber) {
      return NextResponse.json(
        { message: "Missing amount or accountNumber" },
        { status: 400 }
      );
    }

    // 🔍 Lấy account theo accountNumber
    const acc = await prisma.paymentAccount.findFirst({
      where: {
        accountNumber: String(accountNumber).replace(/\s+/g, ""),
        isActive: true,
      },
    });

    if (!acc) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản ngân hàng" },
        { status: 404 }
      );
    }

    if (!acc.bankName) {
      return NextResponse.json(
        {
          message: "Tài khoản ngân hàng chưa cấu hình tên ngân hàng (bankName)",
        },
        { status: 400 }
      );
    }

    // 🏦 Lấy tên ngân hàng → chuyển sang lowercase để map
    const bankName = acc.bankName.trim().toLowerCase();

    const bankCode = BANK_CODE_MAP[bankName];

    if (!bankCode) {
      return NextResponse.json(
        {
          message: `Ngân hàng "${acc.bankName}" chưa được hỗ trợ VietQR`,
        },
        { status: 400 }
      );
    }

    // 📌 Tạo orderCode
    const orderCode = await generateUniqueOrderCode("ORD");

    // 📌 Tạo QR URL
    const amountValue = Math.round(Number(amount));
    const addInfo = encodeURIComponent(orderCode);

    const accountNumberSafe = acc.accountNumber.replace(/\s+/g, "");

    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumberSafe}-compact2.jpg?amount=${amountValue}&addInfo=${addInfo}`;

    return NextResponse.json({
      qrUrl,
      orderCode,
      bank: acc.bankName,
      bankCode,
    });
  } catch (err) {
    console.error("POST /api/payments/vietqr error:", err);
    return NextResponse.json(
      { message: "Failed to create VietQR" },
      { status: 500 }
    );
  }
}
