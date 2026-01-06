import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
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
 * PUT /api/addresses/[id]
 * Body: { line?, ward?, district?, province?, phone?, isDefault? }
 * - Yêu cầu auth
 * - Chỉ cho phép update địa chỉ thuộc về user hiện tại
 * - Nếu isDefault = true -> unset default các địa chỉ khác (transaction)
 * - Cho phép update partial: field nào không gửi lên thì giữ nguyên
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }
    const { id } = await params;

    const addressId = Number(id);
    if (!addressId || Number.isNaN(addressId)) {
      return NextResponse.json(
        { message: "ID địa chỉ không hợp lệ" },
        { status: 400 }
      );
    }

    const existing = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: Number(userId),
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      line,
      ward,
      district,
      province,
      phone,
      isDefault,
    }: {
      line?: string;
      ward?: string | null;
      district?: string;
      province?: string;
      phone?: string | null;
      isDefault?: boolean;
    } = body || {};

    // Build data update (partial)
    const dataToUpdate: any = {};

    if (line !== undefined) dataToUpdate.line = String(line);
    if (ward !== undefined) dataToUpdate.ward = ward ? String(ward) : null;
    if (district !== undefined) dataToUpdate.district = String(district);
    if (province !== undefined) dataToUpdate.province = String(province);
    if (phone !== undefined) dataToUpdate.phone = phone ? String(phone) : null;
    if (isDefault !== undefined) dataToUpdate.isDefault = Boolean(isDefault);

    // Không có field nào để update
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { message: "Không có dữ liệu để cập nhật" },
        { status: 400 }
      );
    }

    let updatedAddress;

    // Nếu set isDefault = true -> transaction unset default ở địa chỉ khác
    if (isDefault === true) {
      updatedAddress = await prisma.$transaction(async (tx: any) => {
        await tx.address.updateMany({
          where: {
            userId: Number(userId),
            isDefault: true,
            NOT: { id: addressId },
          },
          data: { isDefault: false },
        });

        const a = await tx.address.update({
          where: { id: addressId },
          data: {
            ...dataToUpdate,
            isDefault: true, // đảm bảo vẫn là true
          },
        });

        return a;
      });
    } else {
      // update bình thường
      updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: dataToUpdate,
      });
    }

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/addresses/[id] error:", err);
    return NextResponse.json(
      { message: err?.message || "Cập nhật địa chỉ thất bại" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/addresses/[id]
 * - Yêu cầu auth
 * - Chỉ xóa địa chỉ thuộc về user hiện tại
 * - Nếu xóa địa chỉ đang là default:
 *    + Sau khi xóa, nếu còn địa chỉ khác -> set 1 địa chỉ khác làm default (id mới nhất)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const addressId = Number(id);
    if (!addressId || Number.isNaN(addressId)) {
      return NextResponse.json(
        { message: "ID địa chỉ không hợp lệ" },
        { status: 400 }
      );
    }

    // Đảm bảo địa chỉ thuộc về user hiện tại
    const existing = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: Number(userId),
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    const deletedAddress = await prisma.$transaction(async (tx: any) => {
      // Xóa địa chỉ
      const deleted = await tx.address.delete({
        where: { id: addressId },
      });

      // Nếu địa chỉ vừa xóa là default -> set 1 địa chỉ khác làm default
      if (deleted.isDefault) {
        const another = await tx.address.findFirst({
          where: { userId: Number(userId) },
          orderBy: { id: "desc" }, // ưu tiên địa chỉ mới nhất
        });

        if (another) {
          await tx.address.update({
            where: { id: another.id },
            data: { isDefault: true },
          });
        }
      }

      return deleted;
    });

    return NextResponse.json(
      { message: "Xóa địa chỉ thành công", address: deletedAddress },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE /api/addresses/[id] error:", err);
    return NextResponse.json(
      { message: err?.message || "Xóa địa chỉ thất bại" },
      { status: 500 }
    );
  }
}
