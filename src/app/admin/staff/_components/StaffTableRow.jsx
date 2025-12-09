"use client";

import { Edit, Eye, Trash, Mail, Shield } from "lucide-react";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";
import Image from "next/image";

// Màu nền avatar ngẫu nhiên
const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function StaffTableRow({
  staff,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "S");
  const getAvatarColor = (id) =>
    avatarColors[id % avatarColors.length] || "bg-gray-500";

  // Render Role Badges
  const renderRoles = () => {
    if (!staff.staffRoles || staff.staffRoles.length === 0) {
      return (
        <span className="text-gray-400 text-xs italic">Chưa phân quyền</span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1">
        {staff.staffRoles.map((sr) => (
          <span
            key={sr.roleId}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {sr.role?.name || `Role #${sr.roleId}`}
          </span>
        ))}
      </div>
    );
  };

  return (
    <tr
      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/10" : ""
      }`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
          #{staff.id}
        </td>
      )}

      {columnVisibility.name && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            {staff.avatar ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_URL_IMAGE || ""}${
                  staff.avatar
                }`}
                alt={staff.name || "Staff Avatar"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${getAvatarColor(
                  staff.id
                )}`}
              >
                {getInitial(staff.name)}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {staff.name || "N/A"}
              </div>
            </div>
          </div>
        </td>
      )}

      {columnVisibility.email && (
        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            {staff.email}
          </div>
        </td>
      )}

      {columnVisibility.roles && <td className="px-6 py-4">{renderRoles()}</td>}

      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${
              staff.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : staff.status === "blocked"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {staff.status === "active"
              ? "Hoạt động"
              : staff.status === "blocked"
              ? "Đã khóa"
              : staff.status}
          </span>
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          {new Date(staff.createdAt).toLocaleDateString("vi-VN")}
        </td>
      )}

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center space-x-2">
          <button
            onClick={onQuickView}
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_STAFF}>
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"
              title="Sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.DELETE_STAFF}>
            <button
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              title="Xóa"
            >
              <Trash className="w-4 h-4" />
            </button>
          </PermissionGate>
        </div>
      </td>
    </tr>
  );
}
