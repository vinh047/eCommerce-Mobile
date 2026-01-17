"use client";

import { Edit, Trash, Eye, Package } from "lucide-react";
import Link from "next/link";
import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

// Helper format tiền tệ
const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  if (typeof value === "string" && value.includes("-")) return value;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function ProductsTableRow({
  product,
  isSelected,
  onSelect,
  onDelete,
}) {
  return (
    <tr
      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 border-gray-300 cursor-pointer"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Placeholder Image - Sau này thay bằng thẻ <Image> */}
          <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">
              {product.name}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              ID: {product.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="text-blue-600 font-semibold text-sm">
          {formatCurrency(product.priceRange)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Tồn:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {product.totalStock}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex flex-col">
          <span>{product.categoryName || "---"}</span>
          <span className="text-xs text-gray-400">{product.brandName}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              product.isActive ? "bg-green-500" : "bg-gray-500"
            }`}
          ></span>
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <PermissionGate
        permission={
          (PERMISSION_KEYS.UPDATE_PRODUCT, PERMISSION_KEYS.DELETE_PRODUCT)
        }
      >
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end items-center gap-1">
            {/* Nút Edit dẫn sang trang chi tiết */}
            <PermissionGate permission={PERMISSION_KEYS.UPDATE_PRODUCT}>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </PermissionGate>
            <PermissionGate permission={PERMISSION_KEYS.DELETE_PRODUCT}>
              <button
                onClick={() => onDelete(product.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
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
