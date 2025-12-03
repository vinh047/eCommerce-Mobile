"use client";

import {
  Edit,
  Eye,
  Trash,
  Folder,
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function CategoriesTableRow({
  category,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  console.log(columnVisibility);
  const renderDynamicIcon = (iconKey) => {
    if (!iconKey) return <ImageIcon className="w-4 h-4 text-gray-400" />;

    const IconComponent = LucideIcons[iconKey];
    return IconComponent ? (
      <IconComponent className="w-4 h-4 text-blue-600" />
    ) : (
      <span className="text-xs font-mono">{iconKey}</span>
    );
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
          #{category.id}
        </td>
      )}

      {columnVisibility.name && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
              {category.iconKey ? (
                renderDynamicIcon(category.iconKey)
              ) : (
                <Folder className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {category.name}
            </div>
          </div>
        </td>
      )}

      {columnVisibility.slug && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          /{category.slug}
        </td>
      )}

      {columnVisibility.parent && (
        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
          {category.parent ? (
            <div className="flex items-center space-x-1">
              <FolderOpen className="w-3 h-3 text-gray-400" />
              <span>{category.parent.name}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs italic">-- Gốc --</span>
          )}
        </td>
      )}

      {columnVisibility.icon && (
        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
          {category.iconKey ? (
            <div className="flex items-center space-x-1">
              <FolderOpen className="w-3 h-3 text-gray-400" />
              <span>{category.iconKey}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs italic">Null</span>
          )}
        </td>
      )}

      {columnVisibility.isActive && (
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded font-medium ${
              category.isActive
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            {category.isActive ? "Hoạt động" : "Đã ẩn"}
          </span>
        </td>
      )}

      {columnVisibility.productsCount && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center">
          {category._count?.products || 0}
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
          <PermissionGate permission={PERMISSION_KEYS.CREATE_CATEGORY}>
            <button
              onClick={onEdit}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.CREATE_CATEGORY}>
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
