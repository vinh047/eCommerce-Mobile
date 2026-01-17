import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function CouponsHeader({ onCreateCoupon, onExportCSV }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Mã giảm giá
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onExportCSV}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
        >
          <i className="fas fa-download mr-2"></i>Xuất Excel
        </button>
        <PermissionGate permission={PERMISSION_KEYS.CREATE_COUPON}>
          <button
            onClick={onCreateCoupon}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
          >
            <i className="fas fa-plus mr-2"></i>Tạo mã giảm giá
          </button>
        </PermissionGate>
      </div>
    </div>
  );
}
