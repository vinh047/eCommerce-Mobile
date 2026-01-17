import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function StaffHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Nhân viên
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Quản lý đội ngũ nhân sự và phân quyền hệ thống.
        </p>
      </div>
      <PermissionGate permission={PERMISSION_KEYS.CREATE_STAFF}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer flex items-center shadow-sm"
          >
            <i className="fas fa-plus mr-2"></i>Thêm nhân viên
          </button>
        </div>
      </PermissionGate>
    </div>
  );
}
