import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: Number(params.id) },
      include: {
        staffRoles: {
          include: { role: true },
        },
      },
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
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
    const { name, status, avatar, roleIds, password } = body;
    const staffId = Number(params.id);

    const updatedStaff = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        name,
        status,
        avatar,
      };

      if (password && password.trim() !== "") {
        updateData.passwordHash = password;
      }

      const staff = await tx.staff.update({
        where: { id: staffId },
        data: updateData,
      });

      if (roleIds && Array.isArray(roleIds)) {
        await tx.staffRole.deleteMany({
          where: { staffId: staffId },
        });

        if (roleIds.length > 0) {
          await tx.staffRole.createMany({
            data: roleIds.map((rId: number) => ({
              staffId: staffId,
              roleId: rId,
            })),
          });
        }
      }

      return await tx.staff.findUnique({
        where: { id: staffId },
        include: { staffRoles: { include: { role: true } } },
      });
    });

    return NextResponse.json(updatedStaff);
  } catch (error: any) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { message: "Failed to update staff", error: error.message },
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

    await prisma.staff.delete({ where: { id } });

    return NextResponse.json({ message: "Staff deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
