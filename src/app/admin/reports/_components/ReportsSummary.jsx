"use client";

import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function ReportsSummary({ summary }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const cards = [
    {
      title: "Doanh thu",
      value: formatCurrency(summary?.revenue || 0),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Đơn hàng",
      value: summary?.orders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Khách hàng mới",
      value: summary?.customers || 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Giá trị TB đơn",
      value: formatCurrency(summary?.avgOrderValue || 0),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${card.bg}`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}