import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";
import { Plus } from "lucide-react";

export default function BannerHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Banner
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Quản lý hình ảnh quảng cáo và liên kết sản phẩm.
        </p>
      </div>
      <PermissionGate permission={PERMISSION_KEYS.CREATE_BANNER}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm Banner
          </button>
        </div>
      </PermissionGate>
    </div>
  );
}