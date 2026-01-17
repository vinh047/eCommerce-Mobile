"use client";

import {
  Shield,
  CornerDownLeft,
  Trash,
  MousePointerSquareDashed,
} from "lucide-react";

export default function PermissionBulkActionsBar({
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
          <Shield className="w-5 h-5 text-blue-700 dark:text-blue-300" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            {selectedCount} quyền hạn được chọn
          </span>

          <button
            onClick={onSelectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
          >
            <MousePointerSquareDashed className="w-4 h-4 mr-1" />
            Chọn tất cả
          </button>

          <button
            onClick={onDeselectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
          >
            <CornerDownLeft className="w-4 h-4 mr-1" />
            Bỏ chọn
          </button>
        </div>

        {/* Các Hành động Hàng loạt (chủ yếu là Xóa) */}
        <div className="flex items-center space-x-2">
          {/* Action: Xóa */}
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
