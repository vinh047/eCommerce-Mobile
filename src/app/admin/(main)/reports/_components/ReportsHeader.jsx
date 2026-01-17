"use client";

import { Download } from "lucide-react";

export default function ReportsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Báo cáo & Thống kê
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Phân tích hiệu quả kinh doanh và xu hướng bán hàng.
        </p>
      </div>
      <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center shadow-sm">
        <Download className="w-4 h-4 mr-2" /> Xuất báo cáo
      </button>
    </div>
  );
}