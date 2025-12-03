"use client";

import {
  Edit,
  Eye,
  Trash,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function VariantsTableRow({
  variant,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Lấy ảnh đại diện (giả định variant có mảng MediaVariant hoặc url ảnh preview)
  const previewImage = variant.MediaVariant.find((mv) => mv.Media.isPrimary)
    ? variant.MediaVariant.find((mv) => mv.Media.isPrimary).Media.url
    : variant.MediaVariant.length > 0
    ? variant.MediaVariant[0].Media.url
    : null;

  return (
    <tr className="table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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
          #{variant.id}
        </td>
      )}

      {/* Cột Hình ảnh */}
      {columnVisibility.image && (
        <td className="px-6 py-4">
          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
            {previewImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_URL_IMAGE}${previewImage}`}
                alt={"product image"}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </td>
      )}

      {columnVisibility.productName && (
        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
          {variant.product?.name || "N/A"}
        </td>
      )}

      {columnVisibility.color && (
        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
              style={{ backgroundColor: variant.color.toLowerCase() }}
            ></span>
            <span>{variant.color}</span>
          </div>
        </td>
      )}

      {columnVisibility.price && (
        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
          <div className="flex flex-col">
            <span>{formatCurrency(variant.price)}</span>
            {variant.compareAtPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatCurrency(variant.compareAtPrice)}
              </span>
            )}
          </div>
        </td>
      )}

      {columnVisibility.stock && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                variant.stock <= (variant.lowStockThreshold || 5)
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {variant.stock}
            </span>
            {variant.stock <= (variant.lowStockThreshold || 5) && (
              <AlertTriangle
                className="w-4 h-4 text-amber-500"
                title="Sắp hết hàng"
              />
            )}
          </div>
        </td>
      )}

      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded ${
              variant.isActive
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {variant.isActive ? "Đang bán" : "Ẩn"}
          </span>
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          {formatDate(variant.createdAt)}
        </td>
      )}

      <td className="px-1 py-4 text-center">
        <div className="flex justify-center space-x-1">
          <button
            onClick={onQuickView}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_VARIANT}>
            <button
              onClick={onEdit}
              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>

          <PermissionGate permission={PERMISSION_KEYS.DELETE_VARIANT}>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
            >
              <Trash className="w-4 h-4" />
            </button>
          </PermissionGate>
        </div>
      </td>
    </tr>
  );
}
