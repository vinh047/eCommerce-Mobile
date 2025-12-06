import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isDeleted: false },
      include: { product: { select: { slug: true } } },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Lỗi khi lấy banner:", error);

    return NextResponse.json(
      { error: "Không thể tải banner" },
      { status: 500 }
    );
  }
}
