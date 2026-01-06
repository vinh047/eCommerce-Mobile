import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const roles = await prisma.role.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: roles.map((r: any) => r.id) });
  } catch (error) {
    console.error("Error fetching role IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}