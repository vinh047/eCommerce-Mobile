import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { name, permissionIds } = body;
    const { id } = await params;
    const roleId = Number(id);
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    const staffCount = await prisma.staffRole.count({
      where: { roleId: numericId },
    });

    if (staffCount > 0) {
      return NextResponse.json(
        {
          error: `Không thể xóa. Có ${staffCount} nhân viên đang giữ vai trò này.`,
        },
        { status: 400 }
      );
    }

    await prisma.role.delete({ where: { id: numericId } });

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
