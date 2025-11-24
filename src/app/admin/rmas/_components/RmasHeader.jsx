"use client";

import { Plus } from "lucide-react";

export default function RmasHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yêu cầu Đổi trả & Bảo hành (RMA)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Xử lý khiếu nại và yêu cầu bảo hành từ khách hàng.
        </p>
      </div>
      
      <button
        onClick={onCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-sm transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" /> Tạo yêu cầu
      </button>
    </div>
  );
}