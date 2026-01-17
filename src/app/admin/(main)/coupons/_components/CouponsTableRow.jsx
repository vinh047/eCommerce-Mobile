"use client";

import {
  Edit,
  Eye,
  Trash,
  Tag,
  Percent,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

const couponAvatarClasses = [
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-indigo-400 to-purple-500",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-cyan-500 to-blue-400",
  "bg-gradient-to-br from-pink-300 to-yellow-300",
];

export default function CouponTableRow({
  coupon,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getAvatarClass = (id) => {
    const index = parseInt(String(id).slice(-1)) || 0;
    return couponAvatarClasses[index % couponAvatarClasses.length];
  };

  const getInitial = (code) => {
    if (!code) return "C";
    return code.charAt(0).toUpperCase();
  };

  const formatValue = (value, type) => {
    const amount = parseFloat(value);
    if (type === "percentage") {
      return `${amount}%`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // --- RENDERING ---

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

      {/* ID  */}
      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
          #{coupon.id}
        </td>
      )}

      {/* Code (Mã giảm giá) */}
      {columnVisibility.code && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 ${getAvatarClass(
                coupon.id
              )} rounded-full flex items-center justify-center text-white font-semibold text-base flex-shrink-0`}
            >
              {getInitial(coupon.code)}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                {coupon.code || "N/A"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {coupon.type === "percentage" ? "Giảm %" : "Giảm cố định"}
              </div>
            </div>
          </div>
        </td>
      )}

      {/* Value (Giá trị) */}
      {columnVisibility.value && (
        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
          {formatValue(coupon.value, coupon.type)}
        </td>
      )}

      {/* Type (Loại) */}
      {columnVisibility.type && (
        <td className="px-6 py-4 text-center">
          {coupon.type === "percentage" ? (
            <Percent
              className="w-5 h-5 text-purple-600 mx-auto"
              title="Giảm phần trăm"
            />
          ) : (
            <DollarSign
              className="w-5 h-5 text-green-600 mx-auto"
              title="Giảm cố định"
            />
          )}
        </td>
      )}

      {/* Usage Limit (Lượt sử dụng / Giới hạn) */}
      {columnVisibility.usageLimit && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-4 h-4 text-gray-500" />
            <span>
              {coupon.used || 0} / {coupon.usageLimit || "∞"}
            </span>
          </div>
        </td>
      )}

      {/* Status (Trạng thái) */}
      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded ${
              coupon.status === "active"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : coupon.status === "blocked"
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {coupon.status === "active"
              ? "Hoạt động"
              : coupon.status === "blocked"
              ? "Đã khóa"
              : "Đã xóa"}
          </span>
        </td>
      )}

      {/* Ends At (Ngày hết hạn) */}
      {columnVisibility.endsAt && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          {formatDate(coupon.endsAt)}
        </td>
      )}

      {/* Actions */}
      <td className="px-1 py-4 text-center">
        <div className="flex justify-center space-x-1">
          <button
            onClick={onQuickView}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </button>
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_COUPON}>
            <button
              onClick={onEdit}
              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 cursor-pointer"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.DELETE_COUPON}>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
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
