import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const revenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "paid" },
    });
    const totalRevenue = Number(revenueAgg._sum.total) || 0;

    const ordersCount = await prisma.order.count();

    const paidOrders = await prisma.order.count({
      where: { paymentStatus: "paid" },
    });
    const paymentRate = ordersCount > 0 ? (paidOrders / ordersCount) * 100 : 0;

    const LOW_STOCK_THRESHOLD = 10;
    const lowStockCount = await prisma.variant.count({
      where: {
        isDeleted: false,
        isActive: true,
        stock: {
          lte: LOW_STOCK_THRESHOLD,
        },
      },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    const recentReviews = await prisma.review.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
        product: { select: { name: true } },
      },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ordersLast7Days = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        paymentStatus: "paid",
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    const salesMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("vi-VN", { weekday: "short" });

      if (!salesMap.has(key)) salesMap.set(key, 0);
    }

    ordersLast7Days.forEach((order) => {
      const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN", {
        weekday: "short",
      });
      const current = salesMap.get(dateKey) || 0;
      salesMap.set(dateKey, current + Number(order.total));
    });

    const salesData = Array.from(salesMap, ([date, revenue]) => ({
      date,
      revenue,
    })).reverse();

    const alerts = [];
    if (lowStockCount > 0) {
      alerts.push({
        type: "warning",
        title: "Cảnh báo kho hàng",
        description: `Có ${lowStockCount} sản phẩm tồn kho dưới ${LOW_STOCK_THRESHOLD}. Nhấn vào thẻ KPI để xem chi tiết.`,
        
      });
    }

    const pendingOrders = await prisma.order.count({
      where: { status: "pending" },
    });

    if (pendingOrders > 0) {
      alerts.push({
        type: "info",
        title: "Đơn hàng mới",
        description: `Đang có ${pendingOrders} đơn hàng chờ xác nhận.`,
      });
    }

    return NextResponse.json({
      kpi: {
        revenue: totalRevenue,
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
