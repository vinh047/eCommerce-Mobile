"use client";

import {
  Tag,
  CheckCircle,
  EyeOff,
  Trash,
  CornerDownLeft,
  MousePointerSquareDashed,
} from "lucide-react";

export default function BrandBulkActionsBar({
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
            <Tag className="w-5 h-5 mr-2" />
            <span>{selectedCount} thương hiệu đang chọn</span>
          </div>

          <button
            onClick={onSelectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center cursor-pointer"
          >
            <MousePointerSquareDashed className="w-4 h-4 mr-1" />
            Chọn tất cả trang
          </button>

          <button
            onClick={onDeselectAll}
            className="text-gray-600 dark:text-gray-400 hover:underline text-sm flex items-center cursor-pointer"
          >
            <CornerDownLeft className="w-4 h-4 mr-1" />
            Bỏ chọn
          </button>
        </div>

        {/* Các nút hành động */}
        <div className="flex items-center space-x-2">
          {/* Kích hoạt */}
          <button
            onClick={() => onBulkAction("active")}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center transition-colors shadow-sm"
            title="Hiển thị các thương hiệu đã chọn"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Kích hoạt
          </button>

          {/* Ẩn (Inactive) */}
          <button
            onClick={() => onBulkAction("inactive")}
            className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 flex items-center transition-colors shadow-sm"
            title="Ẩn các thương hiệu đã chọn"
          >
            <EyeOff className="w-4 h-4 mr-1.5" />
            Ẩn
          </button>

          {/* Xóa */}
          <button
            onClick={() => onBulkAction("delete")}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center transition-colors shadow-sm"
            title="Xóa vĩnh viễn"
          >
            <Trash className="w-4 h-4 mr-1.5" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}