import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lấy tất cả IDs của Coupons dựa trên bộ lọc (dùng cho Select All)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    const where: any = {
      NOT: { status: "deleted" },
    };
    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }
    if (status) {
      const statuses = status.split(",");
      where.status = { in: statuses };
    }
    if (type) {
      const types = type.split(",");
      where.type = { in: types };
    }

    const coupons = await prisma.coupon.findMany({
      where,
      select: { id: true }, 
    });

    return NextResponse.json({ ids: coupons.map((c: any) => c.id) });
  } catch (error) {
    console.error("Error fetching coupon IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}
