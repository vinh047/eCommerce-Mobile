"use client";

import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function OrdersHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Đơn hàng
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Theo dõi và xử lý đơn hàng từ khách hàng.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        {/* Nút export nếu cần */}
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
          Xuất Excel
        </button>
        <PermissionGate permission={PERMISSION_KEYS.CREATE_ORDER}>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer flex items-center shadow-sm"
          >
            Tạo đơn hàng
          </button>
        </PermissionGate>
      </div>
    </div>
  );
}
