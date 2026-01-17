"use client";

import { Plus, Download, Boxes } from "lucide-react";
import { useExportVariantsCSV } from "../utils/exportVariantsCSV";

export default function VariantsHeader({ onCreate }) {
  // Gọi hook export CSV ở top level
  const { exportVariantsCSV } = useExportVariantsCSV();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Boxes className="w-8 h-8 text-blue-600" />
          Quản lý Biến thể
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Quản lý chi tiết màu sắc, giá bán và tồn kho của từng sản phẩm.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={exportVariantsCSV}
          className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm bg-white dark:bg-gray-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </button>
        
        <button
          onClick={onCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm biến thể
        </button>
      </div>
    </div>
  );
}