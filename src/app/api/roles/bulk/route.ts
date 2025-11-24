import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  try {
    if (action === "delete") {
      // Kiểm tra ràng buộc trước khi xóa hàng loạt
      // Tìm các role đang được gán cho nhân viên
      const rolesInUse = await prisma.staffRole.findMany({
        where: { roleId: { in: ids } },
        select: { roleId: true },
        distinct: ['roleId']
      });

      const roleIdsInUse = rolesInUse.map(r => r.roleId);
      const idsSafeToDelete = ids.filter((id: number) => !roleIdsInUse.includes(id));

      if (idsSafeToDelete.length > 0) {
        await prisma.role.deleteMany({
          where: { id: { in: idsSafeToDelete } },
        });
      }

      if (roleIdsInUse.length > 0) {
          return NextResponse.json({ 
              success: true, 
              message: `Đã xóa ${idsSafeToDelete.length} vai trò. ${roleIdsInUse.length} vai trò không thể xóa vì đang có nhân viên sử dụng.` 
          });
      }

      return NextResponse.json({ success: true, message: "Đã xóa thành công." });
    }

    return NextResponse.json({ error: "Action not supported" }, { status: 400 });
  } catch (error) {
    console.error("Bulk role action error:", error);
    return NextResponse.json(
      { message: "Bulk action failed" },
      { status: 500 }
    );
  }
}