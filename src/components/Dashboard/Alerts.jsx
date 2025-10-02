// src/components/Dashboard/Alerts.jsx
const alerts = [
  {
    icon: "fas fa-exclamation-triangle",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    title: "Sắp hết hàng",
    description: "iPhone 15 Pro chỉ còn 3 chiếc",
  },
  {
    icon: "fas fa-clock",
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    title: "Coupon sắp hết hạn",
    description: "SALE20 hết hạn trong 2 ngày",
  },
  {
    icon: "fas fa-exchange-alt",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    title: "RMA mới",
    description: "3 yêu cầu đổi trả chờ xử lý",
  },
];

export default function Alerts() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cảnh báo
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg ${alert.bgColor}`}
          >
            <i className={`${alert.icon} ${alert.iconColor} mt-1`}></i>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {alert.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
