"use client";

import {
  Folder,
  CheckCircle,
  EyeOff,
  Trash,
  CornerDownLeft,
  MousePointerSquareDashed,
} from "lucide-react";

export default function CategoryBulkActionsBar({
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
      rounded-lg p-4 mb-4 transition-transform duration-300 shadow-sm
      ${show ? "transform translate-y-0" : "transform -translate-y-full"}
    `}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
            <Folder className="w-5 h-5 mr-2" />
            <span>{selectedCount} danh mục đang chọn</span>
          </div>

          <button
            onClick={onSelectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center cursor-pointer"
          >
            <MousePointerSquareDashed className="w-4 h-4 mr-1" />
            Chọn tất cả
          </button>

          <button
            onClick={onDeselectAll}
            className="text-gray-600 dark:text-gray-400 hover:underline text-sm flex items-center cursor-pointer"
          >
            <CornerDownLeft className="w-4 h-4 mr-1" />
            Bỏ chọn
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onBulkAction("active")}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Kích hoạt
          </button>

          <button
            onClick={() => onBulkAction("inactive")}
            className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 flex items-center transition-colors shadow-sm"
          >
            <EyeOff className="w-4 h-4 mr-1.5" />
            Ẩn
          </button>

          <button
            onClick={() => onBulkAction("delete")}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center transition-colors shadow-sm"
          >
            <Trash className="w-4 h-4 mr-1.5" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}