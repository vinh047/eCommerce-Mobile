"use client";

import { Edit, Trash, Users, ShieldAlert } from "lucide-react";
import { PERMISSION_KEYS } from "../../constants/permissions";
import PermissionGate from "../../_components/PermissionGate";

function RolesTableRow({ role, onEdit, onDelete }) {
  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");
  const permissionsCount = role.rolePermissions?.length || 0;
  const staffCount = role.staffRoles?.length || 0; // Số lượng nhân viên có role này

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">
        #{role.id}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">
          {role.name}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <ShieldAlert className="w-4 h-4 mr-2 text-blue-500" />
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
            {permissionsCount} quyền
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          {staffCount} nhân viên
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(role.createdAt)}
      </td>
      <PermissionGate
        permission={(PERMISSION_KEYS.UPDATE_ROLE, PERMISSION_KEYS.DELETE_ROLE)}
      >
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <PermissionGate permission={PERMISSION_KEYS.UPDATE_ROLE}>
              <button
                onClick={() => onEdit(role)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-gray-600"
                title="Sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
            </PermissionGate>
            <PermissionGate permission={PERMISSION_KEYS.DELETE_ROLE}>
              <button
                onClick={() => onDelete(role.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-gray-600"
                title="Xóa"
              >
                <Trash className="w-4 h-4" />
              </button>
            </PermissionGate>
          </div>
        </td>
      </PermissionGate>
    </tr>
  );
}

export default function RolesTable({ roles, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Danh sách Vai trò & Quyền hạn
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 uppercase text-xs text-gray-500 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Tên Vai trò</th>
              <th className="px-6 py-3">Số lượng Quyền</th>
              <th className="px-6 py-3">Nhân sự áp dụng</th>
              <th className="px-6 py-3">Ngày tạo</th>
              <PermissionGate
                permission={
                  (PERMISSION_KEYS.UPDATE_ROLE, PERMISSION_KEYS.DELETE_ROLE)
                }
              >
                <th className="px-6 py-3">Thao tác</th>
              </PermissionGate>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Chưa có vai trò nào.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <RolesTableRow
                  key={role.id}
                  role={role}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
