"use client";

import ordersApi from "@/lib/api/ordersApi";
import { X, ShoppingCart, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrdersQuickViewModal({ order, onClose, onEdit }) {
  // 1. Khởi tạo state: dùng order ban đầu làm mặc định, sau đó sẽ cập nhật khi fetch xong
  const [detailOrder, setDetailOrder] = useState(order);
  const [isLoading, setIsLoading] = useState(false);

  // 2. useEffect để fetch dữ liệu chi tiết khi order.id thay đổi
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!order?.id) return;

      setIsLoading(true);
      try {
        const res = await ordersApi.getOrderById(order.id);
        const data = await res;
        console.log(data)
        setDetailOrder(data);
      } catch (error) {
        console.error("Lỗi khi fetch chi tiết đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [order?.id]);

  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-blue-600 text-white">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Đơn hàng {detailOrder?.code || order.code}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-blue-100 text-sm">Ngày tạo</p>
              <p className="font-medium">
                {detailOrder?.createdAt
                  ? new Date(detailOrder.createdAt).toLocaleDateString("vi-VN")
                  : "..."}
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Tổng tiền</p>
              <p className="font-bold text-2xl">
                {Number(detailOrder?.total || 0).toLocaleString()} ₫
              </p>
            </div>
          </div>
        </div>

        {/* Content Container với Loading Overlay */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Màn hình Loading (hiện đè lên khi đang fetch) */}
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-gray-800/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                Đang cập nhật dữ liệu...
              </p>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Customer */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Khách hàng
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {detailOrder?.user?.name || `ID: ${detailOrder?.userId}`}
                </p>
                <p className="text-xs text-gray-500">
                  {detailOrder?.user?.email}
                </p>
                {/* Hiển thị thêm địa chỉ nếu có */}
                {detailOrder?.user?.addresses &&
                  detailOrder.user.addresses.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">
                      {detailOrder.user.addresses[0].addressLine}
                    </p>
                  )}
              </div>
            </div>

            {/* Statuses */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg dark:border-gray-600">
                <p className="text-xs text-gray-500">Trạng thái đơn</p>
                <span
                  className={`font-medium capitalize ${
                    detailOrder?.status === "completed"
                      ? "text-green-600"
                      : detailOrder?.status === "cancelled"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {detailOrder?.status}
                </span>
              </div>
              <div className="p-3 border rounded-lg dark:border-gray-600">
                <p className="text-xs text-gray-500">Thanh toán</p>
                <span
                  className={`font-medium capitalize ${
                    detailOrder?.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {detailOrder?.paymentStatus}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-semibold mb-3 dark:text-white flex justify-between">
                <span>Chi tiết sản phẩm</span>
                <span className="text-xs font-normal text-gray-500">
                  ({detailOrder?.items?.length || 0} món)
                </span>
              </h4>
              <div className="space-y-3">
                {detailOrder?.items?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex justify-between text-sm border-b pb-2 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium dark:text-gray-200">
                        {item.nameSnapshot}
                      </p>
                      {/* Hiển thị thêm tên biến thể nếu có */}
                      {item.variant && (
                        <p className="text-xs text-blue-500">
                          Phân loại: {item.variant.sku || item.variant.id}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-medium dark:text-gray-200">
                      {(Number(item.price) * item.quantity).toLocaleString()} ₫
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="dark:text-gray-300">
                    {Number(detailOrder?.subtotal || 0).toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phí ship</span>
                  <span className="dark:text-gray-300">
                    {Number(detailOrder?.shippingFee || 0).toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Giảm giá</span>
                  <span className="text-red-500">
                    -{Number(detailOrder?.discount || 0).toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t font-bold text-base dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">
                    Thành tiền
                  </span>
                  <span className="text-blue-600">
                    {Number(detailOrder?.total || 0).toLocaleString()} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Note nếu có */}
            {detailOrder?.note && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 font-semibold">
                  Ghi chú:
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 italic">
                  {detailOrder.note}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => onEdit(detailOrder)} // Truyền detailOrder mới nhất để edit
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow disabled:opacity-50"
            disabled={isLoading}
          >
            Cập nhật đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
