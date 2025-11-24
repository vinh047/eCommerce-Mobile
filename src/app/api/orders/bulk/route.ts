import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  try {
    // Action có thể là: delete, hoặc update status cụ thể
    if (action === "delete") {
      await prisma.order.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, message: `Deleted ${ids.length} orders` });
    }
    
    // Các action cập nhật trạng thái
    // Ví dụ: bulk action gửi lên là "status:completed" hoặc "payment:paid"
    // Ở đây ta xử lý đơn giản theo các keyword
    let updateData: any = {};
    
    // Status orders
    if (["pending", "processing", "completed", "cancelled"].includes(action)) {
        updateData.status = action;
    }
    // Payment status (prefix 'pay_')
    else if (action.startsWith("pay_")) {
        const status = action.replace("pay_", ""); // pay_paid -> paid
        if (["pending", "paid", "failed"].includes(status)) {
            updateData.paymentStatus = status;
        }
    }

    if (Object.keys(updateData).length > 0) {
        await prisma.order.updateMany({
            where: { id: { in: ids } },
            data: updateData,
        });
        return NextResponse.json({ success: true, message: "Bulk update successful" });
    }

    return NextResponse.json({ error: "Action not supported" }, { status: 400 });
  } catch (error: any) {
    console.error("Bulk order action error:", error);
    return NextResponse.json(
      { message: "Bulk action failed", error: error.message },
      { status: 500 }
    );
  }
}