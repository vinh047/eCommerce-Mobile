"use client";

import {
  CheckCircle,
  EyeOff,
  Trash,
  CornerDownLeft,
  LayoutTemplate,
} from "lucide-react";

export default function SpecBulkActionsBar({
  selectedCount,
  onDeselectAll,
  onBulkAction,
  show,
}) {
  if (!show) return null;

  return (
    <div
      className={`
      fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
      shadow-xl rounded-full px-6 py-3 flex items-center gap-6
      transition-all duration-300 ${show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
    `}
    >
      <div className="flex items-center gap-3 border-r pr-6 border-gray-200 dark:border-gray-700">
        <span className="flex items-center font-medium text-gray-900 dark:text-white">
          <LayoutTemplate className="w-5 h-5 mr-2 text-blue-600" />
          {selectedCount} đã chọn
        </span>
        <button
          onClick={onDeselectAll}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 flex items-center"
        >
          <CornerDownLeft className="w-4 h-4 mr-1" /> Bỏ chọn
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onBulkAction("active")}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
        >
          <CheckCircle className="w-4 h-4 mr-1.5" /> Kích hoạt
        </button>
        <button
          onClick={() => onBulkAction("inactive")}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <EyeOff className="w-4 h-4 mr-1.5" /> Ẩn
        </button>
        <button
          onClick={() => onBulkAction("delete")}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash className="w-4 h-4 mr-1.5" /> Xóa
        </button>
      </div>
    </div>
  );
}