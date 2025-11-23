"use client";

import { X, User, ShoppingCart, Package, Calendar } from "lucide-react";

export default function CartQuickViewModal({ cart, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Giả định dữ liệu items. Trong thực tế bạn cần relation variant để lấy tên SP
  const cartItems = cart.items || [];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Slide Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-500" /> 
            Chi tiết Giỏ hàng #{cart.id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* User Info Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex items-start space-x-4">
            <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Chủ sở hữu</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {cart.user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{cart.user?.email}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Tạo ngày: {formatDate(cart.createdAt)}
              </div>
            </div>
          </div>

          {/* Items List */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Danh sách sản phẩm ({cartItems.length})
          </h3>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium">
                <tr>
                  <th className="px-4 py-3">Sản phẩm / Variant ID</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                  <th className="px-4 py-3 text-right">Ngày thêm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <tr key={item.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.variant?.name || `Variant #${item.variantId}`}
                        </div>
                        <div className="text-xs text-gray-500">
                           Mã CartItem: {item.id}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                        x{item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {/* Schema không có createdAt cho CartItem, dùng tạm cart date hoặc N/A */}
                        {formatDate(cart.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500 italic">
                      Giỏ hàng trống
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
                onClick={onClose}
                className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm"
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
}