import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 1. LẤY THAM SỐ VÀ XÁC ĐỊNH THỜI GIAN
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7days"; // 7days, 30days, this_month

    const endDate = new Date();
    const startDate = new Date();

    if (range === "30days") {
      startDate.setDate(endDate.getDate() - 30);
    } else if (range === "this_month") {
      startDate.setDate(1); // Ngày mùng 1 đầu tháng
    } else {
      startDate.setDate(endDate.getDate() - 7); // Mặc định 7 ngày
    }

    // Đặt giờ về đầu ngày và cuối ngày để query chính xác
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // 2. QUERY DỮ LIỆU TỪ DB (Dùng Promise.all để chạy song song cho nhanh)
    const [
      ordersInPeriod,
      totalOrdersCount,
      paidOrdersCount,
      lowStockCount,
      recentOrders,
      recentReviews,
      topSellingItems
    ] = await Promise.all([
      // a. Lấy đơn hàng để vẽ biểu đồ (Chỉ lấy đơn đã thanh toán)
      prisma.order.findMany({
        where: {
          paymentStatus: "paid",
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { createdAt: true, total: true }, // Chỉ lấy trường cần thiết
      }),

      // b. Tổng số đơn trong khoảng thời gian
      prisma.order.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),

      // c. Đơn đã thanh toán (để tính tỷ lệ)
      prisma.order.count({
        where: { 
          paymentStatus: "paid",
          createdAt: { gte: startDate, lte: endDate }
        },
      }),

      // d. Sản phẩm sắp hết hàng (Giả sử field là 'stock' trong Variant)
      prisma.variant.count({
         where: { stock: { lte: 10 } } // Dữ liệu thật: tìm variant có stock <= 10
      }),

      // e. Đơn hàng gần đây
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),

      // f. Review mới nhất
      prisma.review.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, avatar: true } },
          product: { select: { name: true } },
        },
      }),

      // g. Top sản phẩm bán chạy (Dựa trên OrderItem)
      prisma.orderItem.groupBy({
        by: ["nameSnapshot"], // Hoặc productId nếu bạn muốn
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
        where: { order: { createdAt: { gte: startDate, lte: endDate } } },
      }),
    ]);

    // 3. XỬ LÝ DỮ LIỆU BIỂU ĐỒ (REAL DATA LOGIC)
    // Tạo map để gom nhóm doanh thu theo ngày: "01/11" => 5000000
    const salesMap = new Map<string, { revenue: number; orders: number }>();

    ordersInPeriod.forEach((order) => {
      // Chuyển ngày order thành string dạng "DD/MM" (theo múi giờ VN)
      const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });

      const current = salesMap.get(dateKey) || { revenue: 0, orders: 0 };
      salesMap.set(dateKey, {
        revenue: current.revenue + Number(order.total),
        orders: current.orders + 1,
      });
    });

    // Tạo mảng dữ liệu liên tục từ startDate đến endDate (để không bị khuyết ngày)
    const chartData = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      
      const data = salesMap.get(dateKey) || { revenue: 0, orders: 0 };
      
      chartData.push({
        date: dateKey,
        revenue: data.revenue,
        orders: data.orders,
      });

      // Tăng thêm 1 ngày
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 4. TÍNH TOÁN KPI TỔNG HỢP
    // Tổng doanh thu trong kỳ (Tính từ mảng ordersInPeriod đã query để tiết kiệm 1 query aggregate)
    const totalRevenue = ordersInPeriod.reduce(
      (acc, order) => acc + Number(order.total),
      0
    );
    
    const paymentRate = totalOrdersCount > 0 ? (paidOrdersCount / totalOrdersCount) * 100 : 0;

    // Map lại top selling products
    const topProducts = topSellingItems.map((item: any) => ({
      name: item.nameSnapshot,
      quantity: item._sum.quantity,
      // Doanh thu ước tính của sp này = giá lúc mua * số lượng
      revenue: Number(item._sum.price) * (item._sum.quantity || 0), 
    }));

    // 5. CẢNH BÁO (ALERTS)
    const alerts = [];
    if (lowStockCount > 0) {
      alerts.push({
        type: "warning",
        title: "Cảnh báo kho hàng",
        description: `Có ${lowStockCount} phân loại sản phẩm sắp hết hàng (<10).`,
      });
    }
    
    // Tìm đơn chờ xử lý (Pending)
    const pendingOrdersCount = await prisma.order.count({ where: { status: "pending" } });
    if (pendingOrdersCount > 0) {
      alerts.push({
        type: "info",
        title: "Đơn hàng mới",
        description: `Có ${pendingOrdersCount} đơn hàng đang chờ xử lý.`,
      });
    }

    // 6. TRẢ VỀ RESPONSE
    return NextResponse.json({
      summary: {
        revenue: totalRevenue,
        orders: totalOrdersCount,
        paymentRate: paymentRate.toFixed(1),
        lowStock: lowStockCount,
      },
      chartData: chartData, // Dữ liệu thật đã được group theo ngày
      topProducts: topProducts,
      recentOrders: recentOrders,
      recentReviews: recentReviews,
      alerts: alerts,
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}