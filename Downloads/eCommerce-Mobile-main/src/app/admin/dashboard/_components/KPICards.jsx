import {
  LineChart,
  ShoppingCart,
  Warehouse,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

export default function KPICards({ data }) {
  // Format tiền tệ
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const kpis = [
    {
      title: "Doanh thu tổng",
      value: formatCurrency(data?.revenue || 0),
      change: "---", // Cần logic so sánh quá khứ để tính %
      changeColor: "text-green-600",
      icon: LineChart,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      title: "Tổng đơn hàng",
      value: data?.orders || 0,
      change: "---",
      changeColor: "text-blue-600",
      icon: ShoppingCart,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
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
    },
    {
      title: "Tỷ lệ thanh toán",
      value: `${data?.paymentRate || 0}%`,
      change: "---",
      changeColor: "text-green-600",
      icon: CreditCard,
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {kpi.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {kpi.value}
              </p>
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
