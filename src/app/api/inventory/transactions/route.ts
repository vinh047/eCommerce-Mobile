import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Device } from "@prisma/client";

async function generateTicketCode(type: string, tx: any): Promise<string> {
  const prefix = type === "in" ? "IN" : type === "out" ? "OUT" : "AUDIT";

  const count = await tx.inventoryTicket.count({
    where: { type: type as any },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");
  return `${prefix}${nextNumber}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },

        {
          transactions: {
            some: {
              variant: {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { sku: { contains: search, mode: "insensitive" } },
                ],
              },
            },
          },
        },

        {
          transactions: {
            some: {
              devices: {
                some: {
                  device: {
                    identifier: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
          },
        },
      ];
    }

    const totalItems = await prisma.inventoryTicket.count({ where });

    const data = await prisma.inventoryTicket.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        staff: {
          select: { id: true, name: true, email: true },
        },

        transactions: {
          include: {
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (err: any) {
    console.error("Error fetching inventory tickets:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, reason, createdById, transactions } = body;

    if (!type || !createdById || !transactions || transactions.length === 0) {
      return NextResponse.json(
        {
          error:
            "Thiếu thông tin bắt buộc (type, createdById, hoặc transactions rỗng)",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const ticketCode = await generateTicketCode(type, tx);

      const newTicket = await tx.inventoryTicket.create({
        data: {
          code: ticketCode,
          type: type as any,
          note: reason,
          createdBy: createdById || 1,
          status: "COMPLETED",
        },
      });

      const createdTransactions = [];

      for (const txnItem of transactions) {
        const { variantId, quantity, deviceIdentifiers } = txnItem;

        if (!variantId || !quantity) {
          throw new Error("Mỗi dòng giao dịch phải có variantId và quantity.");
        }
        if (deviceIdentifiers && deviceIdentifiers.length !== quantity) {
          throw new Error(
            `Số lượng serial (${deviceIdentifiers.length}) không khớp với số lượng nhập/xuất (${quantity}) cho variantId ${variantId}`
          );
        }

        let deviceRecords: Device[] = [];

        if (type === "in") {
          for (const identifier of deviceIdentifiers || []) {
            const device = await tx.device.upsert({
              where: { identifier },
              update: {
                status: "in_stock",
                variantId,
              },
              create: {
                identifier,
                variantId,
                status: "in_stock",
              },
            });
            deviceRecords.push(device);
          }
        } else if (type === "out") {
          const availableDevices = await tx.device.findMany({
            where: {
              identifier: { in: deviceIdentifiers },
              status: "in_stock",
              variantId: variantId,
            },
          });

          if (availableDevices.length !== deviceIdentifiers.length) {
            const foundIdentifiers = availableDevices.map((d: any) => d.identifier);
            const missing = deviceIdentifiers.filter(
              (id: string) => !foundIdentifiers.includes(id)
            );
            throw new Error(
              `Các serial sau không khả dụng cho variantId ${variantId}: ${missing.join(
                ", "
              )}`
            );
          }

          await tx.device.updateMany({
            where: { identifier: { in: deviceIdentifiers } },
            data: { status: "sold" },
          });

          deviceRecords = availableDevices;
        }

        const createdTxn = await tx.inventoryTransaction.create({
          data: {
            ticketId: newTicket.id,
            variantId,
            quantity,

            devices: {
              create: deviceRecords.map((dev: any) => ({
                device: { connect: { id: dev.id } },
              })),
            },
          },
          include: {
            variant: true,
            devices: {
              include: { device: true },
            },
          },
        });

        createdTransactions.push(createdTxn);
      }

      return { ...newTicket, transactions: createdTransactions };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("Error creating inventory ticket:", err);

    const status =
      err.message.includes("serial") || err.message.includes("Thiếu thông tin")
        ? 400
        : 500;
    return NextResponse.json({ error: err.message }, { status: status });
  }
}
