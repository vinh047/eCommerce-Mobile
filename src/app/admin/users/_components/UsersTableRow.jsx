"use client";

import { Edit, Eye, Trash, User, Mail, Shield, UserCog } from "lucide-react";

// Các class màu nền giả định cho avatar nếu không có ảnh
const userAvatarClasses = [
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-indigo-400 to-purple-500",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-cyan-500 to-blue-400",
  "bg-gradient-to-br from-pink-300 to-yellow-300",
];

export default function UserTableRow({
  user,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Lấy class màu nền cho avatar dựa trên ID
  const getAvatarClass = (id) => {
    // Sử dụng ký tự cuối cùng của ID để lấy màu
    const index = parseInt(String(id).slice(-1)) || 0;
    return userAvatarClasses[index % userAvatarClasses.length];
  };

  // Hàm tạo chữ cái đầu tiên (Initial)
  const getInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // --- RENDERING ---

  return (
    <tr className="table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4">
        {/* Checkbox chọn hàng */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>

      {/* ID  */}
      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
          #{user.id}
        </td>
      )}

      {/* Name & Email (Thay thế Name & SKU) */}
      {columnVisibility.name && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            {/* Avatar hoặc Initial */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-10 h-10 ${getAvatarClass(
                  user.id
                )} rounded-full flex items-center justify-center text-white font-semibold text-base`}
              >
                {getInitial(user.name)}
              </div>
            )}

            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name || "N/A"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {user.email}
              </div>
            </div>
          </div>
        </td>
      )}

      {/* Status (Trạng thái tài khoản - Thay thế Category) */}
      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded ${
              user.status === "active"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {user.status === "active"
              ? "Hoạt động"
              : user.status === "blocked"
              ? "Đã khóa"
              : "Chờ duyệt"}
          </span>
        </td>
      )}

      {/* Orders Count (Số lượng đơn hàng - Thay thế Rating) */}
      {columnVisibility.orders && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center space-x-2">
            <UserCog className="w-4 h-4 text-gray-500" />
            <span>{user.ordersCount || 0} đơn</span>
          </div>
        </td>
      )}

      {/* Created At (Ngày tạo) */}
      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          {formatDate(user.createdAt)}
        </td>
      )}

      {/* Actions (Giữ nguyên các hành động) */}
      <td className="px-1 py-4 text-center">
        <div className="flex justify-center space-x-1">
          <button
            onClick={onQuickView}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800"
            title="Xóa"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
