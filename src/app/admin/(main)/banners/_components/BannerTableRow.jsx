"use client";

import { Edit, Eye, Trash, Link, ImageOff } from "lucide-react";
import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";
import Image from "next/image";

export default function BannerTableRow({
  banner,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
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
          #{banner.id}
        </td>
      )}

      {columnVisibility.image && (
        <td className="px-6 py-4">
          <div className="h-12 w-20 relative rounded bg-gray-100 border border-gray-200 overflow-hidden">
            {banner.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_URL_IMAGE || ""}${
                  banner.image
                }`}
                alt={banner.altText || "Banner Image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <ImageOff className="w-5 h-5" />
              </div>
            )}
          </div>
        </td>
      )}

      {columnVisibility.altText && (
        <td
          className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate"
          title={banner.altText}
        >
          {banner.altText || <span className="text-gray-400 italic">--</span>}
        </td>
      )}

      {columnVisibility.product && (
        <td className="px-6 py-4">
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            <Link className="w-3.5 h-3.5 mr-1.5" />
            {banner.product?.name || `Product #${banner.productId}`}
          </div>
        </td>
      )}

      {columnVisibility.displayOrder && (
        <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          {banner.displayOrder}
        </td>
      )}

      {columnVisibility.isActive && (
        <td className="px-6 py-4">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${
              banner.isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {banner.isActive ? "Hiển thị" : "Ẩn"}
          </span>
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
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_BANNER}>
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"
              title="Sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.DELETE_BANNER}>
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
