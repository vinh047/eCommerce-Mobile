"use client";

import { Edit, Eye, Trash, Star, Image as ImageIcon } from "lucide-react";
import { PERMISSION_KEYS } from "../../constants/permissions";
import PermissionGate from "../../_components/PermissionGate";

export default function ReviewsTableRow({
  review,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  // Render stars
  const renderStars = (count) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < count ? "fill-current" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // Check if has photos
  const hasPhotos =
    review.photosJson &&
    Array.isArray(review.photosJson) &&
    review.photosJson.length > 0;

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
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
      </td>

      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
          #{review.id}
        </td>
      )}

      {columnVisibility.product && (
        <td
          className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[200px] truncate"
          title={review.product?.name}
        >
          {review.product?.name || `Product #${review.productId}`}
        </td>
      )}

      {columnVisibility.user && (
        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
          {review.user?.name || `User #${review.userId}`}
        </td>
      )}

      {columnVisibility.stars && (
        <td className="px-6 py-4">{renderStars(review.stars)}</td>
      )}

      {columnVisibility.content && (
        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[250px]">
          <div className="flex items-center">
            {hasPhotos && (
              <ImageIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
            )}
            <span className="truncate" title={review.content}>
              {review.content || "Không có nội dung"}
            </span>
          </div>
        </td>
      )}

      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${
              review.isActived
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {review.isActived ? "Hiển thị" : "Đã ẩn"}
          </span>
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
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
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_REVIEW}>
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"
              title="Kiểm duyệt"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.DELETE_REVIEW}>
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
