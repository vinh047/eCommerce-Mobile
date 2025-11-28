import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    const coupon = await prisma.coupon.findUnique({
      where: { id: numericId },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!coupon || coupon.status === "deleted") {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;
    const numericId = Number(id);

    const updateData = {
      ...data,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      endsAt: data.endsAt ? new Date(data.endsAt) : null,

      code: undefined,
      used: undefined,
    };

    const updatedCoupon = await prisma.coupon.update({
      where: { id: numericId },
      data: updateData,
    });

    return NextResponse.json(updatedCoupon);
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { message: "Failed to update coupon", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;
    const numericId = Number(id);

    const updated = await prisma.coupon.update({
      where: { id: numericId },
      data: {
        ...(data.value !== undefined && { value: data.value }),
        ...(data.minOrder !== undefined && { minOrder: data.minOrder }),
        ...(data.startsAt !== undefined && {
          startsAt: data.startsAt ? new Date(data.startsAt) : null,
        }),
        ...(data.endsAt !== undefined && {
          endsAt: data.endsAt ? new Date(data.endsAt) : null,
        }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
        ...(data.status && { status: data.status }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.brandId !== undefined && { brandId: data.brandId }),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    if (force) {
      await prisma.coupon.delete({ where: { id: numericId } });
      return NextResponse.json({ message: "Coupon permanently deleted" });
    }

    const deletedCoupon = await prisma.coupon.update({
      where: { id: numericId },
      data: { status: "deleted" },
    });

    return NextResponse.json({
      message: "Coupon soft deleted",
      data: deletedCoupon,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
