"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, Loader2, PackageX, ChevronDown } from "lucide-react";
import ordersApi from "@/lib/api/ordersApi";
import OrderCard from "./OrderCard";
import WarrantyModal from "./WarrantyModal";

const PAGE_SIZE = 2; // Số lượng đơn hàng mỗi lần tải

export default function OrdersPageClient() {
  // State quản lý danh sách và phân trang
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để tải không

  // State loading
  const [loading, setLoading] = useState(true); // Loading lần đầu vào trang
  const [loadingMore, setLoadingMore] = useState(false); // Loading khi bấm nút "Xem thêm"

  // State Modal
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- HÀM GỌI API ---
  const fetchOrders = async (p, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // Gọi API lấy danh sách
      const res = await ordersApi.getMyOrders({
        page: p,
        pageSize: PAGE_SIZE,
      });

      const newOrders = res.orders || [];
      const totalItems = res.meta?.totalItems || 0;

      if (isLoadMore) {
        // Nếu là xem thêm -> Nối dữ liệu mới vào cũ
        setOrders((prev) => [...prev, ...newOrders]);
      } else {
        // Nếu là tải lần đầu -> Gán mới hoàn toàn
        setOrders(newOrders);
      }

      // Kiểm tra xem còn dữ liệu để tải tiếp không
      // Logic: Nếu tổng số item hiện có + số vừa tải < tổng số trên server => Còn
      const currentCount = (isLoadMore ? orders.length : 0) + newOrders.length;
      setHasMore(currentCount < totalItems);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // --- EFFECT: TẢI LẦN ĐẦU ---
  useEffect(() => {
    fetchOrders(1, false);
  }, []);

  // --- HANDLER: XEM THÊM ---
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage); // Tăng số trang lên
    fetchOrders(nextPage, true); // Gọi API trang tiếp theo
  };

  const handleOpenWarranty = (order) => {
    setSelectedOrder(order);
    setWarrantyModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm shadow-blue-100">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-sm text-gray-500">
            Quản lý và theo dõi trạng thái đơn hàng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {/* Loading lần đầu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
            <p className="text-sm font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <PackageX className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              Bạn chưa có đơn hàng nào
            </p>
          </div>
        ) : (
          // Danh sách đơn hàng
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOpenWarranty={handleOpenWarranty}
              />
            ))}
          </div>
        )}

        {/* Nút Xem Thêm (Chỉ hiện khi còn dữ liệu) */}
        {!loading && orders.length > 0 && hasMore && (
          <div className="pt-6 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600 transition-all disabled:opacity-70"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải thêm...
                </>
              ) : (
                <>
                  Xem thêm đơn hàng cũ
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Thông báo hết danh sách */}
        {!loading && orders.length > 0 && !hasMore && (
          <div className="pt-8 pb-4 text-center text-xs text-gray-400 font-medium uppercase tracking-wider">
            --- Bạn đã xem hết danh sách ---
          </div>
        )}
      </div>

      {/* Modal Bảo hành (Dùng chung) */}
      <WarrantyModal
        isOpen={warrantyModalOpen}
        onClose={() => setWarrantyModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
