import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getUserIdFromSession(req: Request) {
  // TODO: Replace with real authentication
  // Giả lập user ID 1 (Alice)
  return 1;
}

// GET all addresses
export async function GET() {
  const addresses = await prisma.address.findMany({
    include: { user: true },
  });
  return NextResponse.json(addresses);
}

// POST create new address
// POST create new address (Sửa lại để lấy userId từ session)
export async function POST(req: Request) {
  try {
    // --- LẤY USER ID TỪ SESSION (Bảo mật) ---
    const userId = await getUserIdFromSession(req); // <<< SỬA 1: Lấy userId từ server
    if (!userId) {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }
    // -------------------------------------

    const data = await req.json();
    const { line, phone, ward, district, province, isDefault } = data;

    // ... (Thêm code validation và kiểm tra số lượng địa chỉ) ...
    // Đếm số địa chỉ hiện có của user để quyết định isDefault
    const addressCount = await prisma.address.count({
      where: { userId },
    });

    const address = await prisma.address.create({
      data: {
        userId: userId, // <<< SỬA 2: Dùng userId từ server, KHÔNG dùng data.userId
        line: line,
        phone: phone,
        ward: ward,
        district: district,
        province: province,
        isDefault: addressCount === 0 || (isDefault ?? false),
      },
      select: {
        // <<< SỬA 3 (Tùy chọn): Chỉ trả về dữ liệu an toàn
        id: true,
        line: true,
        phone: true,
        ward: true,
        district: true,
        province: true,
        isDefault: true,
      },
    });
    return NextResponse.json(address, { status: 201 }); // 201 Created
  } catch (error) {
    // <<< SỬA 4: Thêm try...catch để bắt lỗi
    console.error("Error creating address (POST /api/users/addresses):", error);
    return NextResponse.json(
      { error: "Không thể lưu địa chỉ" },
      { status: 500 }
    );
  }
}
