"use client";

import { Edit, Eye, Trash, Tag, Box } from "lucide-react";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function BrandsTableRow({
  brand,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
          #{brand.id}
        </td>
      )}

      {columnVisibility.name && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {brand.name}
            </div>
          </div>
        </td>
      )}

      {columnVisibility.slug && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          /{brand.slug}
        </td>
      )}

      {columnVisibility.isActive && (
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded font-medium ${
              brand.isActive
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            {brand.isActive ? "Hoạt động" : "Đã ẩn"}
          </span>
        </td>
      )}

      {columnVisibility.productsCount && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center space-x-1">
            <Box className="w-4 h-4 text-gray-400" />
            <span>{brand._count?.products || 0}</span>
          </div>
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          {formatDate(brand.createdAt)}
        </td>
      )}

      <td className="px-1 py-4 text-center">
        <div className="flex justify-center space-x-1">
          <button
            onClick={onQuickView}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Xem"
          >
            <Eye className="w-4 h-4" />
          </button>
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_BRAND}>
            <button
              onClick={onEdit}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.DELETE_BRAND}>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800"
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
