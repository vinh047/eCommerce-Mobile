import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Kiểm tra danh sách serial
export async function POST(req: Request) {
  try {
    const { identifiers } = await req.json(); // Array string

    if (!identifiers || !Array.isArray(identifiers)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Tìm các devices có serial này
    const devices = await prisma.device.findMany({
      where: {
        identifier: { in: identifiers },
      },
      select: { identifier: true, status: true, variantId: true },
    });

    // Map kết quả để FE dễ xử lý
    const result = identifiers.map((id: string) => {
      const found = devices.find((d) => d.identifier === id);
      return {
        identifier: id,
        exists: !!found,
        status: found?.status || null,
        variantId: found?.variantId || null,
      };
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
