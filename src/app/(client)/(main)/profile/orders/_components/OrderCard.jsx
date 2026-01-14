"use client";

import Link from "next/link";
import { Calendar, CreditCard, ChevronRight, Package } from "lucide-react";
import { ROUTES } from "@/config/routes";

// Helper components (Badge)
function OrderStatusBadge({ status }) {
  const map = {
    pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    processing: { label: "Đang xử lý", color: "bg-indigo-100 text-indigo-800" },
    shipped: {
      label: "Đang vận chuyển",
      color: "bg-purple-100 text-purple-800",
    },
    delivered: { label: "Đã giao", color: "bg-teal-100 text-teal-800" },
    completed: {
      label: "Hoàn thành",
      color: "bg-emerald-100 text-emerald-800",
    },
    cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-600" },
    returned: { label: "Trả hàng", color: "bg-rose-100 text-rose-800" },
    refunded: { label: "Đã hoàn tiền", color: "bg-pink-100 text-pink-800" },
  };
  const cfg = map[status] || map.pending;
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }) {
  if (status === "paid") {
    return (
      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
        ✔ Đã thanh toán
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="text-xs font-medium text-red-600">Thanh toán lỗi</span>
    );
  }
  return (
    <span className="text-xs font-medium text-orange-600">Chưa thanh toán</span>
  );
}

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("vi-VN") : "";

export default function OrderCard({ order, onOpenWarranty }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
              #{order.code}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Body Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-600">
            Tổng tiền:{" "}
            <span className="font-bold text-gray-900 text-lg">
              {formatCurrency(order.total)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
            <PaymentBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          {order.status === "completed" && (
            <button
              onClick={() => onOpenWarranty(order)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
            >
              Bảo hành
            </button>
          )}
          <Link
            href={ROUTES.PROFILE.orderDetail(order.id)}
            className="flex-1 sm:flex-none text-center px-4 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-black rounded-lg shadow-sm transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
