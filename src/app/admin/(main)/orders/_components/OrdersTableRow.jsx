"use client";

import { Edit, Eye, Trash, User } from "lucide-react";
import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Map status colors
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"; // pending
  }
};

const getPaymentColor = (status) => {
  switch (status) {
    case "paid":
      return "text-green-600 dark:text-green-400";
    case "failed":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-yellow-600 dark:text-yellow-400";
  }
};

export default function OrdersTableRow({
  order,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  return (
    <tr
      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/10" : ""
      }`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {columnVisibility.code && (
        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          {order.code}
        </td>
      )}

      {columnVisibility.user && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1 text-gray-400" />
            {order.user?.name || `User #${order.userId}`}
          </div>
        </td>
      )}

      {columnVisibility.total && (
        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
          {formatCurrency(order.total)}
        </td>
      )}

      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </td>
      )}

      {columnVisibility.payment && (
        <td className="px-6 py-4 text-sm">
          <span
            className={`font-medium ${getPaymentColor(order.paymentStatus)}`}
          >
            {order.paymentStatus}
          </span>
        </td>
      )}

      {columnVisibility.shipping && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          {order.shippingStatus || "N/A"}
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
        </td>
      )}

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center space-x-2">
          <button
            onClick={onQuickView}
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_ORDER_STATUS}>
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"
              title="Sửa trạng thái"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>

          <PermissionGate permission={PERMISSION_KEYS.DELETE_ORDER}>
            <button
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              title="Xóa/Hủy"
            >
              <Trash className="w-4 h-4" />
            </button>
          </PermissionGate>
        </div>
      </td>
    </tr>
  );
}
