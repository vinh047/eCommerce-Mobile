import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lấy danh sách phương thức thanh toán
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isActiveParam = searchParams.get("isActive"); 

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActiveParam !== null && isActiveParam !== undefined) {
      where.isActive = isActiveParam === "true";
    }

    // Lấy list kèm theo accounts con
    const methods = await prisma.paymentMethod.findMany({
      where,
      include: {
        accounts: {
          orderBy: { id: "asc" }, // Sắp xếp tk ngân hàng
        },
      },
      orderBy: { displayOrder: "asc" }, // Sắp xếp phương thức theo thứ tự hiển thị
    });

    return NextResponse.json({ data: methods });
  } catch (err: any) {
    console.error("Error fetching payment methods:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Tạo phương thức thanh toán mới
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Kiểm tra trùng code
    const existing = await prisma.paymentMethod.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Mã phương thức (code) đã tồn tại." },
        { status: 400 }
      );
    }

    const newMethod = await prisma.paymentMethod.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        logoUrl: data.logoUrl,
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder || 0,
      },
    });

    return NextResponse.json(newMethod, { status: 201 });
  } catch (err: any) {
    console.error("Error creating payment method:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}