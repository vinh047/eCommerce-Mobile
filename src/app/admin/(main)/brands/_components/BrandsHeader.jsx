import { useExportBrandsCSV } from "../utils/exportBrandsCSV";
import { Download, Plus } from "lucide-react";

export default function BrandsHeader({ onCreateBrand }) {
  const { exportBrandsCSV } = useExportBrandsCSV();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Thương hiệu
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Quản lý danh sách thương hiệu và trạng thái hiển thị trên website.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={exportBrandsCSV}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </button>
        <button
          onClick={onCreateBrand}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm thương hiệu
        </button>
      </div>
    </div>
  );
}