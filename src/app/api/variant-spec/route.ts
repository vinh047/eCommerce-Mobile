import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const specTemplateId = searchParams.get("specTemplateId");

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { label: { contains: search, mode: "insensitive" } },
      ];
    }

    if (specTemplateId) {
      where.specTemplateId = Number(specTemplateId);
    }

    const data = await prisma.variantSpec.findMany({
      where,
      orderBy: { orderIndex: "asc" },
      include: {
        template: {
          select: { name: true },
        },
        options: true,
      },
    });

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("GET VariantSpec Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.specTemplateId || !body.code || !body.label || !body.datatype) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: specTemplateId, code, label, datatype",
        },
        { status: 400 }
      );
    }

    const newSpec = await prisma.variantSpec.create({
      data: {
        specTemplateId: Number(body.specTemplateId),
        code: body.code,
        label: body.label,
        valueType: body.valueType || "SINGLE",
        datatype: body.datatype,
        unit: body.unit,
        filterable: body.filterable ?? false,
        control: body.control || "INPUT",
        isRequired: body.isRequired ?? false,
        isVariantKey: body.isVariantKey ?? false,
        orderIndex: body.orderIndex || 0,
      },
    });

    return NextResponse.json(newSpec, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Mã thông số (code) đã tồn tại trong template này." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
