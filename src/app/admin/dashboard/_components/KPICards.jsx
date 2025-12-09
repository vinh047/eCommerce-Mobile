"use client"; // Đảm bảo component này chạy ở client

import {
  LineChart,
  ShoppingCart,
  Warehouse,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import hook điều hướng

export default function KPICards({ data }) {
  const router = useRouter();

  // Format tiền tệ
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Hàm xử lý khi click vào thẻ KPI
  const handleCardClick = (kpi) => {
    if (kpi.link) {
      router.push(kpi.link);
    }
  };

  const kpis = [
    {
      title: "Doanh thu tổng",
      value: formatCurrency(data?.revenue || 0),
      change: "---",
      changeColor: "text-green-600",
      icon: LineChart,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600",
      link: "/admin/orders", // Ví dụ: Link đến trang đơn hàng
    },
    {
      title: "Tổng đơn hàng",
      value: data?.orders || 0,
      change: "---",
      changeColor: "text-blue-600",
      icon: ShoppingCart,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      link: "/admin/orders",
    },
    {
      title: "Sản phẩm sắp hết",
      value: data?.lowStock || 0,
      change: "Cần nhập thêm",
      changeColor: "text-orange-600",
      icon: Warehouse,
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
      changeIcon: AlertTriangle,
      // QUAN TRỌNG: Link này sẽ điều hướng người dùng đến trang danh sách sản phẩm
      // Bạn cần xử lý logic lấy query param `status=low_stock` ở trang products
      link: "/admin/variants?stockStatus=low_stock%2Cout_of_stock",
      isClickable: true, // Đánh dấu để style cursor
    },
    {
      title: "Tỷ lệ thanh toán",
      value: `${data?.paymentRate || 0}%`,
      change: "---",
      changeColor: "text-green-600",
      icon: CreditCard,
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      link: "/admin/analytics",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(kpi)}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 
            ${
              kpi.link
                ? "cursor-pointer hover:shadow-md hover:scale-[1.02]"
                : ""
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {kpi.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {kpi.value}
              </p>
              {/* Hiển thị dòng phụ chú nếu là thẻ Low Stock */}
              {kpi.change && (
                <div className="flex items-center mt-2 space-x-1">
                  {kpi.changeIcon && (
                    <kpi.changeIcon size={14} className={kpi.changeColor} />
                  )}
                  <span className={`text-xs font-medium ${kpi.changeColor}`}>
                    {kpi.change}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.iconBg}`}
            >
              <kpi.icon className={`${kpi.iconColor} w-6 h-6`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
