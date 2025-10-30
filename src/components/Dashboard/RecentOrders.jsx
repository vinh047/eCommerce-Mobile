// src/components/Dashboard/RecentOrders.jsx
const recentOrders = [
  {
    id: "#ORD-2024-001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@email.com",
    status: "Đang xử lý",
    total: "₫15.990.000",
    statusColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    statusIcon: "fas fa-clock",
  },
  {
    id: "#ORD-2024-002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@email.com",
    status: "Đã giao",
    total: "₫8.490.000",
    statusColor:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    statusIcon: "fas fa-check",
  },
  {
    id: "#ORD-2024-003",
    customerName: "Lê Văn C",
    customerEmail: "levanc@email.com",
    status: "Đã hủy",
    total: "₫12.990.000",
    statusColor: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    statusIcon: "fas fa-times",
  },
];

export default function RecentOrders() {
  return (
    <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Đơn hàng gần đây
          </h3>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Xem tất cả
          </a>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentOrders.map((order, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {order.customerName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {order.customerEmail}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`status-badge ${order.statusColor}`}>
                    <i className={`${order.statusIcon} mr-1`}></i>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-700 mr-3">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className={
                      order.status === "Đã giao"
                        ? "text-gray-400"
                        : "text-green-600 hover:text-green-700"
                    }
                  >
                    <i
                      className={
                        order.status === "Đã hủy"
                          ? "fas fa-undo"
                          : "fas fa-check"
                      }
                    ></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
