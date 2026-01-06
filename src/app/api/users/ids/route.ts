import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const statusQuery = searchParams.get("statusQuery") || "";

    const where: any = {
      NOT: { status: "deleted" },
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (statusQuery) {
      const statuses = statusQuery.split(",");
      where.status = { in: statuses };
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: users.map((u: any) => u.id) });
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}
