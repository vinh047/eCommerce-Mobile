// src/app/api/addresses/route.ts
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Helper: get authenticated user id from token cookie
 */
async function getAuthUserId(req: NextRequest): Promise<number | null> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || !payload.id) return null;
    return Number(payload.id);
  } catch (err) {
    return null;
  }
}

/**
 * GET /api/addresses
 * - Trả về danh sách địa chỉ của user hiện tại (dựa trên token cookie)
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: Number(userId) },
      orderBy: [{ isDefault: "desc" }, { id: "desc" }],
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/addresses error:", err);
    return NextResponse.json(
      { message: "Lỗi máy chủ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/addresses
 * Body: { line, ward?, district, province, phone?, isDefault? }
 * - Yêu cầu auth (token cookie)
 * - Nếu isDefault = true, unset các địa chỉ default khác trong transaction
 * - Trả về address vừa tạo (201)
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      line,
      ward = null,
      district,
      province = "Hồ Chí Minh",
      phone = null,
      isDefault = false,
    } = body || {};

    // basic validation
    if (!line || !district || !province) {
      return NextResponse.json(
        { message: "Thiếu trường bắt buộc: line, district, province" },
        { status: 400 }
      );
    }

    let createdAddress;
    if (isDefault) {
      // transaction: unset other defaults then create
      createdAddress = await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId: Number(userId), isDefault: true },
          data: { isDefault: false },
        });

        const a = await tx.address.create({
          data: {
            userId: Number(userId),
            line: String(line),
            ward: ward ? String(ward) : null,
            district: String(district),
            province: String(province),
            phone: phone ? String(phone) : null,
            isDefault: true,
          },
        });
        return a;
      });
    } else {
      createdAddress = await prisma.address.create({
        data: {
          userId: Number(userId),
          line: String(line),
          ward: ward ? String(ward) : null,
          district: String(district),
          province: String(province),
          phone: phone ? String(phone) : null,
          isDefault: Boolean(isDefault),
        },
      });
    }

    return NextResponse.json(createdAddress, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/addresses error:", err);
    return NextResponse.json(
      { message: err?.message || "Lưu địa chỉ thất bại" },
      { status: 500 }
    );
  }
}
