import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all addresses
export async function GET() {
  const addresses = await prisma.address.findMany({
    include: { user: true },
  });
  return NextResponse.json(addresses);
}

// POST create new address
export async function POST(req: Request) {
  const data = await req.json();
  const address = await prisma.address.create({
    data: {
      userId: data.userId,
      line: data.line,
      phone: data.phone,
      ward: data.ward,
      district: data.district,
      province: data.province,
      isDefault: data.isDefault ?? false,
    },
  });
  return NextResponse.json(address);
}
