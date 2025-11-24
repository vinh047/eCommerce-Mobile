import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: Number(params.id) },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, permissionIds } = body;
    const roleId = Number(params.id);

    const updatedRole = await prisma.$transaction(async (tx) => {
      const role = await tx.role.update({
        where: { id: roleId },
        data: { name },
      });

      if (permissionIds && Array.isArray(permissionIds)) {
        await tx.rolePermission.deleteMany({
          where: { roleId: roleId },
        });

        if (permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((pId: number) => ({
              roleId: roleId,
              permissionId: pId,
            })),
          });
        }
      }

      return await tx.role.findUnique({
        where: { id: roleId },
        include: { rolePermissions: true },
      });
    });

    return NextResponse.json(updatedRole);
  } catch (error: any) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { message: "Failed to update role", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const staffCount = await prisma.staffRole.count({
      where: { roleId: id },
    });

    if (staffCount > 0) {
      return NextResponse.json(
        {
          error: `Không thể xóa. Có ${staffCount} nhân viên đang giữ vai trò này.`,
        },
        { status: 400 }
      );
    }

    await prisma.role.delete({ where: { id } });

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
