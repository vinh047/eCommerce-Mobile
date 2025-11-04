import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lấy 1 coupon theo id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: Number(params.id) },
      include: { 
        category: true, 
        brand: true 
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

// PUT - Cập nhật toàn bộ thông tin coupon
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    
    //Đảm bảo các trường DateTime được định dạng lại từ string
    const updateData = {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        // Không cho phép cập nhật code, used
        code: undefined, 
        used: undefined, 
    };
    
    const updatedCoupon = await prisma.coupon.update({
      where: { id: Number(params.id) },
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

// PATCH - Cập nhật một phần thông tin (status, value, minOrder, dates, usageLimit)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    
    // Chỉ chấp nhận cập nhật các trường được cho phép (không bao gồm code, type, used)
    const updated = await prisma.coupon.update({
      where: { id: Number(params.id) },
      data: {
        ...(data.value !== undefined && { value: data.value }),
        ...(data.minOrder !== undefined && { minOrder: data.minOrder }),
        ...(data.startsAt !== undefined && { startsAt: data.startsAt ? new Date(data.startsAt) : null }),
        ...(data.endsAt !== undefined && { endsAt: data.endsAt ? new Date(data.endsAt) : null }),
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

//  DELETE - Xóa mềm coupon (đề xuất)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true"; // ?force=true => xóa cứng

    if (force) {
      await prisma.coupon.delete({ where: { id: Number(params.id) } });
      return NextResponse.json({ message: "Coupon permanently deleted" });
    }

    // Xóa mềm bằng cách cập nhật status thành 'deleted'
    const deletedCoupon = await prisma.coupon.update({
      where: { id: Number(params.id) },
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