import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.inventoryTicket.findUnique({
      where: { id: Number(id) },
      include: {
        staff: {
          select: { id: true, name: true, email: true },
        },

        transactions: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },

            devices: {
              include: {
                device: {
                  select: {
                    id: true,
                    identifier: true,
                    status: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Inventory Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error: any) {
    console.error("Error fetching ticket detail:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
