import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 1. Tính toán KPI (Demo đơn giản, thực tế cần tính theo ngày/tháng để so sánh)
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "paid" },
    });

    const ordersCount = await prisma.order.count();

    // Đếm số sản phẩm sắp hết hàng (giả sử < 10 là thấp)
    // Lưu ý: Bạn cần model Inventory hoặc field stock trong Variant.
    // Ở đây mình giả định đếm tổng Variant.
    const lowStockCount = await prisma.variant.count({
      where: { isDeleted: false },
    });

    const paidOrders = await prisma.order.count({
      where: { paymentStatus: "paid" },
    });
    const paymentRate = ordersCount > 0 ? (paidOrders / ordersCount) * 100 : 0;

    // 2. Lấy Đơn hàng gần đây
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    // 3. Lấy Review mới nhất
    const recentReviews = await prisma.review.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
        product: { select: { name: true } },
      },
    });

    // 4. Tạo dữ liệu biểu đồ (Mockup data dựa trên thực tế hoặc query GroupBy date)
    // Prisma GroupBy date khá phức tạp tùy DB, ở đây mình trả về cấu trúc để Frontend map
    const salesData = [
      // Thực tế bạn cần query orders trong 7 ngày qua và group lại
      { date: "T2", revenue: 12000000 },
      { date: "T3", revenue: 15000000 },
      { date: "T4", revenue: 8000000 },
      { date: "T5", revenue: 23000000 },
      { date: "T6", revenue: 18000000 },
      { date: "T7", revenue: 25000000 },
      { date: "CN", revenue: 30000000 },
    ];

    // 5. Cảnh báo (Alerts)
    const alerts = [];
    if (lowStockCount > 0) {
      alerts.push({
        type: "warning",
        title: "Cảnh báo kho hàng",
        description: `Có ${lowStockCount} sản phẩm sắp hết hàng.`,
      });
    }
    // Kiểm tra đơn chờ xử lý
    const pendingOrders = await prisma.order.count({
      where: { status: "pending" },
    });
    if (pendingOrders > 0) {
      alerts.push({
        type: "info",
        title: "Đơn hàng mới",
        description: `Có ${pendingOrders} đơn hàng chờ xử lý.`,
      });
    }

    return NextResponse.json({
      kpi: {
        revenue: Number(totalRevenue._sum.total) || 0,
        orders: ordersCount,
        lowStock: lowStockCount,
        paymentRate: paymentRate.toFixed(1),
      },
      recentOrders,
      recentReviews,
      salesData,
      alerts,
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
