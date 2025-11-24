"use client";

import { Eye, Trash, ShoppingBag, User } from "lucide-react";

export default function CartsTableRow({
  cart,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onDelete,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Tính tổng số lượng item (nếu API trả về items array)
  const itemCount = cart.items ? cart.items.length : 0;
  const totalQuantity = cart.items
    ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <tr className="table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
          #{cart.id}
        </td>
      )}

      {columnVisibility.user && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {cart.user?.name || `User ID: ${cart.userId}`}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {cart.user?.email}
              </div>
            </div>
          </div>
        </td>
      )}

      {columnVisibility.itemsCount && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-gray-500" />
            <span className={`text-sm font-medium ${itemCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              {itemCount} loại ({totalQuantity} sp)
            </span>
          </div>
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          {formatDate(cart.createdAt)}
        </td>
      )}

      <td className="px-1 py-4 text-center">
        <div className="flex justify-center space-x-1">
          <button
            onClick={onQuickView}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
            title="Xem chi tiết giỏ"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
            title="Xóa giỏ hàng"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}