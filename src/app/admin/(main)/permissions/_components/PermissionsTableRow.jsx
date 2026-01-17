"use client";

import { Edit, Trash, Key, Calendar } from "lucide-react";

export default function PermissionsTableRow({
  permission, 
  columnVisibility,
  isSelected,
  onSelect,
  onEdit, 
  onDelete,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <tr className="table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {/* Checkbox */}
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {/* ID  */}
      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
          #{permission.id}
        </td>
      )}

      {/* Key (Khóa) */}
      {columnVisibility.key && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="text-sm font-mono text-gray-900 dark:text-white uppercase break-all">
              {permission.key || "N/A"}
            </div>
          </div>
        </td>
      )}

      {/* Name (Tên Quyền hạn) */}
      {columnVisibility.name && (
        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
          {permission.name || "N/A"}
        </td>
      )}

      {/* Description (Mô tả) */}
      {columnVisibility.description && (
        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-sm truncate">
          {permission.description || "Chưa có mô tả"}
        </td>
      )}

      {/* Created At (Ngày tạo) */}
      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(permission.createdAt)}</span>
          </div>
        </td>
      )}

      {/* Actions (Thao tác) */}
      <td className="px-1 py-4 text-center">
        <div className="flex justify-center space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 cursor-pointer"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
            title="Xóa"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
