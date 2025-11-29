"use client";

import {
  Users,
  CheckCircle,
  Lock,
  Trash,
  CornerDownLeft, 
  MousePointerSquareDashed,
} from "lucide-react";

/**
 * Component UserBulkActionsBar
 * Hiển thị thanh hành động hàng loạt cho người dùng được chọn.
 *
 * @param {number} selectedCount - Số lượng người dùng đã chọn.
 * @param {function} onSelectAll - Hàm gọi khi nhấn 'Chọn tất cả'.
 * @param {function} onDeselectAll - Hàm gọi khi nhấn 'Bỏ chọn'.
 * @param {function} onBulkAction - Hàm gọi khi thực hiện một hành động (ví dụ: onBulkAction('active')).
 * @param {boolean} show - Xác định thanh có hiển thị hay không.
 */
export default function UserBulkActionsBar({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onBulkAction,
  show,
}) {
  if (!show) return null;

  return (
    <div
      className={`
      bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
      rounded-lg p-4 mb-4 transition-transform duration-300
      ${show ? "transform translate-y-0" : "transform -translate-y-full"}
    `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Users className="w-5 h-5 text-blue-700 dark:text-blue-300" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            {selectedCount} người dùng được chọn
          </span>

          {/* Chọn tất cả */}
          <button
            onClick={onSelectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center cursor-pointer"
          >
            <MousePointerSquareDashed className="w-4 h-4 mr-1" />
            Chọn tất cả
          </button>

          {/* Bỏ chọn */}
          <button
            onClick={onDeselectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center cursor-pointer"
          >
            <CornerDownLeft className="w-4 h-4 mr-1" />
            Bỏ chọn
          </button>
        </div>

        {/* Các Hành động Hàng loạt */}
        <div className="flex items-center space-x-2">
          {/* Action 1: Kích hoạt tài khoản */}
          <button
            onClick={() => onBulkAction("active")}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Kích hoạt
          </button>

          {/* Action 2: Khóa tài khoản */}
          <button
            onClick={() => onBulkAction("blocked")}
            className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 flex items-center"
          >
            <Lock className="w-4 h-4 mr-1" />
            Khóa tài khoản
          </button>

          {/* Action 4: Xóa */}
          <button
            onClick={() => onBulkAction("delete")}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center"
          >
            <Trash className="w-4 h-4 mr-1" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
