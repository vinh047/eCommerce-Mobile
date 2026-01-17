"use client";

import { Download, Trash2 } from "lucide-react";

export default function CartsHeader({ onCleanup }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Giỏ hàng
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Theo dõi giỏ hàng và nhu cầu mua sắm của khách hàng.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer">
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </button>
        {/* Tính năng ví dụ: Xóa các giỏ hàng rỗng hoặc quá hạn */}
        <button
          onClick={onCleanup}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Dọn dẹp rác
        </button>
      </div>
    </div>
  );
}