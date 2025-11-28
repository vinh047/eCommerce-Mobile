import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VariantSpecValue } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const variant = await prisma.variant.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        MediaVariant: { include: { Media: true } },
        variantSpecValues: {
          include: {
            VariantSpec: {
              include: {
                template: true,
                buckets: true,
                options: true,
                values: true,
              },
            },
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    return NextResponse.json(variant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    // 1. Tách variantSpecValues ra riêng để xử lý relation
    // Tách cả productId (thường không cho sửa) và MediaVariant (xử lý riêng nếu cần)
    const {
      productId,
      MediaVariant,
      variantSpecValues, // Tách cái này ra
      id: _, // Bỏ id ra khỏi updateData để tránh lỗi Prisma
      ...updateData
    } = data;

    const updated = await prisma.variant.update({
      where: { id: Number(id) },
      data: {
        ...updateData, // Chỉ update các field cơ bản (price, stock, color...)

        // Xử lý relation variantSpecValues
        variantSpecValues: {
          deleteMany: {}, // Xóa hết specs cũ
          create: Array.isArray(variantSpecValues)
            ? variantSpecValues.map((v: any) => ({
                specKey: v.specKey,
                label: v.label,
                type: v.type,
                unit: v.unit,
                // Đảm bảo convert đúng kiểu dữ liệu
                stringValue: v.stringValue ?? "",
                numericValue: v.numericValue ? Number(v.numericValue) : null,
                booleanValue: v.booleanValue ?? null,
              }))
            : [],
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update Error:", error); // Log lỗi ra để dễ debug
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.variant.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Variant deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
