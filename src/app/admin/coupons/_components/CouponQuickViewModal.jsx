"use client";

import {
  X,
  Tag, // ⭐ Icon đại diện cho Coupon
  Calendar,
  DollarSign,
  Percent, // ⭐ Icon cho loại giảm giá
  ClipboardList, // ⭐ Icon cho giới hạn sử dụng
  Edit,
  Copy,
} from "lucide-react";

// Các class màu nền giả định cho mã giảm giá
const couponAvatarClasses = [
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-indigo-400 to-purple-500",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-cyan-500 to-blue-400",
  "bg-gradient-to-br from-pink-300 to-yellow-300",
];

export default function CouponQuickViewModal({
  // ⭐ CouponQuickViewModal
  coupon, // ⭐ Dữ liệu coupon
  onClose,
  onEdit,
  onDuplicate,
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getInitial = (code) => {
    if (!code) return "C";
    return code.charAt(0).toUpperCase();
  };

  const getAvatarClass = (id) => {
    const index = parseInt(String(id).slice(-1)) || 0;
    return couponAvatarClasses[index % couponAvatarClasses.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatValue = (value, type) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    return formatCurrency(value);
  };

  // Dữ liệu giả định hoạt động (ít liên quan đến coupon, có thể bỏ qua hoặc thay thế bằng log)
  const mockActivities = [
    {
      id: 1,
      type: "Áp dụng thành công",
      detail: `Đơn hàng #${Math.floor(Math.random() * 90000) + 10000}`,
      date: "2025-10-10",
    },
    {
      id: 2,
      type: "Tạo mới",
      detail: "Mã giảm giá được khởi tạo",
      date: formatDate(new Date().toISOString()),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      {/* Slide Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-blue-500" /> Chi tiết Mã giảm giá
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto pb-24">
          {/* Coupon Info */}
          <div className="flex items-start space-x-6 mb-8">
            {/* Avatar */}
            <div
              className={`w-24 h-24 ${getAvatarClass(
                coupon.id
              )} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-3xl`}
            >
              {getInitial(coupon.code)}
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {coupon.code || "Mã giảm giá mới"}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>ID: {coupon.id}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    coupon.status === "active"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {coupon.status === "active" ? "Hoạt động" : "Đã khóa"}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Value & Type Info */}
            <div className="grid grid-cols-2 gap-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  {coupon.type === "percentage" ? (
                    <Percent className="w-4 h-4 mr-1" />
                  ) : (
                    <DollarSign className="w-4 h-4 mr-1" />
                  )}{" "}
                  Giá trị giảm
                </h4>
                <p className="text-gray-900 dark:text-white text-lg font-semibold break-all">
                  {formatValue(coupon.value, coupon.type)}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" /> Đơn hàng tối thiểu
                </h4>
                <p className="text-gray-900 dark:text-white text-lg font-semibold">
                  {formatCurrency(coupon.minOrder)}
                </p>
              </div>
            </div>

            {/* Usage & Time Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thống kê & Thời gian
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                  <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {coupon.used || 0} / {coupon.usageLimit || "∞"}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Lượt sử dụng
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatDate(coupon.startsAt)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Bắt đầu
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
                  <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatDate(coupon.endsAt)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Kết thúc
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Hoạt động gần đây
              </h4>
              <div className="space-y-3">
                {mockActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500 font-medium">
                        {activity.type}:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {activity.detail}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onDuplicate}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Nhân bản
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
