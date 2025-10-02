// src/components/Dashboard/KPICards.jsx
const kpis = [
  {
    title: "Doanh thu hôm nay",
    value: "₫45.2M",
    change: "+12.5%",
    changeColor: "text-green-600",
    icon: "fas fa-chart-line",
    iconBg: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600",
  },
  {
    title: "Đơn hàng mới",
    value: "127",
    change: "+8.2%",
    changeColor: "text-blue-600",
    icon: "fas fa-shopping-cart",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
  },
  {
    title: "Thiết bị trong kho",
    value: "2,847",
    change: "23 sắp hết",
    changeColor: "text-orange-600",
    icon: "fas fa-warehouse",
    iconBg: "bg-orange-100 dark:bg-orange-900/20",
    iconColor: "text-orange-600",
    changeIcon: "fas fa-exclamation-triangle",
  },
  {
    title: "Tỷ lệ thanh toán",
    value: "94.8%",
    change: "+2.1%",
    changeColor: "text-green-600",
    icon: "fas fa-credit-card",
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600",
  },
];

export default function KPICards() {
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </p>
              <p
                className={`text-sm flex items-center mt-1 ${kpi.changeColor}`}
              >
                <i
                  className={`${
                    kpi.changeIcon ||
                    (kpi.change.startsWith("+")
                      ? "fas fa-arrow-up"
                      : "fas fa-arrow-down")
                  } mr-1`}
                ></i>
                {kpi.change}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.iconBg}`}
            >
              <i className={`${kpi.icon} ${kpi.iconColor} text-xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
