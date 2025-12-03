import PermissionGate from "@/app/admin/_components/PermissionGate";
import { Download, Plus } from "lucide-react";

export default function PageHeader({
  title,
  onExport,
  onCreate,
  exportLabel = "Xuất dữ liệu",
  createLabel = "Tạo mới",
  permission,
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center space-x-3">
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> {exportLabel}
          </button>
        )}

        <PermissionGate permission={permission}>
          {onCreate && (
            <button
              onClick={onCreate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" /> {createLabel}
            </button>
          )}
        </PermissionGate>
      </div>
    </div>
  );
}
