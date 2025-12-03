import { PackagePlus, PackageMinus, ClipboardList } from "lucide-react";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function InventoryHeader({ onCreateTransaction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Kho & Tồn kho
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi nhập/xuất và quản lý Serial/IMEI thiết bị
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Nút Kiểm kê */}
        <PermissionGate permission={PERMISSION_KEYS.MANAGE_INVENTORY}>
          <button
            onClick={() => onCreateTransaction("adjustment")}
            className="px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium flex items-center transition-colors"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Kiểm kê
          </button>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Nút Xuất Kho */}
          <button
            onClick={() => onCreateTransaction("out")}
            className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium flex items-center transition-colors"
          >
            <PackageMinus className="w-4 h-4 mr-2" />
            Xuất kho
          </button>

          {/* Nút Nhập Kho */}
          <button
            onClick={() => onCreateTransaction("in")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center transition-colors"
          >
            <PackagePlus className="w-4 h-4 mr-2" />
            Nhập kho
          </button>
        </PermissionGate>
      </div>
    </div>
  );
}
