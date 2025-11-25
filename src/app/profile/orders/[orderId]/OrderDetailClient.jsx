"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import usersApi from "@/lib/api/usersApi";

// Format money
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

// Format datetime
const formatDateTime = (iso) =>
  iso
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso))
    : "";

// Order Status
function OrderStatusBadge({ status }) {
  const map = {
    pending: {
      label: "Chờ xác nhận",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-sky-50 text-sky-700 border-sky-200",
    },
    processing: {
      label: "Đang xử lý",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    shipped: {
      label: "Đã gửi hàng",
      className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    delivered: {
      label: "Đã giao",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-gray-50 text-gray-500 border-gray-200",
    },
    returned: {
      label: "Đã trả hàng",
      className: "bg-orange-50 text-orange-700 border-orange-200",
    },
    refunded: {
      label: "Đã hoàn tiền",
      className: "bg-lime-50 text-lime-700 border-lime-200",
    },
  };

  const cfg = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// Payment badge
function PaymentStatusBadge({ status }) {
  const map = {
    pending: {
      label: "Chưa thanh toán",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    paid: {
      label: "Đã thanh toán",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    failed: {
      label: "Thanh toán lỗi",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const cfg = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// MAIN COMPONENT
export default function OrderDetailClient({ orderId }) {
  const [profile, setProfile] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const user = await usersApi.getCurrentUser();

        if (cancelled) return;

        if (!user?.id) {
          setError("Bạn chưa đăng nhập hoặc không lấy được thông tin tài khoản.");
          setLoading(false);
          return;
        }

        setProfile(user);

        const res = await fetch(`/api/orders/me/${orderId}?userId=${user.id}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setError("Không thể tải chi tiết đơn hàng.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setOrder(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, [orderId]);

  // Loading
  if (loading)
    return (
      <div className="space-y-4 text-sm text-gray-500">
        <Link href="/profile/orders" className="text-xs text-blue-600 hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
        Đang tải chi tiết đơn hàng...
      </div>
    );

  // Error
  if (error || !order)
    return (
      <div className="space-y-4">
        <Link href="/profile/orders" className="text-xs text-blue-600 hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || <>Không tìm thấy đơn hàng với ID {orderId}</>}
        </div>
      </div>
    );

  // API mapping
  const addressSnapshot = order.addressSnapshot || {};
  const address = addressSnapshot.address || {};
  const customer = addressSnapshot.customer || {};

  const transaction = order.transactions?.[0] || null;

  const paymentMethodLabel =
    transaction?.methodName ||
    transaction?.methodCode ||
    "Không có thông tin";

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/profile/orders" className="text-xs text-blue-600 hover:underline">
        ← Quay lại danh sách đơn hàng
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Đơn hàng {order.code}
          </h1>
          <p className="text-sm text-gray-500">
            Đặt lúc {formatDateTime(order.createdAt)}
          </p>
          <div className="mt-2 flex gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Address & payment */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping */}
        <div className="rounded-xl border bg-white px-5 py-4 text-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Thông tin nhận hàng</h2>
          <div className="space-y-1">
            <div className="font-medium">{customer.name}</div>
            <div>{customer.phone || address.phone}</div>
            <div>
              {address.line}
              {address.ward && `, ${address.ward}`}
              {address.district && `, ${address.district}`}
              {address.province && `, ${address.province}`}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl border bg-white px-5 py-4 text-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Thanh toán & vận chuyển</h2>

          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">Hình thức thanh toán</span>
              <div>{paymentMethodLabel}</div>

              {transaction && (
                <div className="text-xs text-gray-500 mt-1">
                  Mã giao dịch #{transaction.id} – Số tiền:{" "}
                  {formatCurrency(transaction.amount)} –{" "}
                  {transaction.status === "pending"
                    ? "Chờ thanh toán"
                    : transaction.status}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs text-gray-500">Ghi chú</span>
              <div>{order.note || "Không có ghi chú"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-xl border bg-white overflow-hidden text-sm">
        <div className="border-b bg-gray-50 px-5 py-3 font-semibold">Sản phẩm</div>

        <div className="divide-y">
          {order.items.map((item) => {
            const unitPrice = Number(item.price);
            const lineTotal = unitPrice * item.quantity;

            return (
              <div key={item.id} className="px-5 py-3 flex justify-between">
                <div>
                  <div className="font-medium">{item.nameSnapshot}</div>
                  {item.variantColor && (
                    <div className="text-xs text-gray-500">Màu: {item.variantColor}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Số lượng: {item.quantity}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(lineTotal)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.quantity} × {formatCurrency(unitPrice)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Total */}
      <section className="rounded-xl border bg-white px-5 py-4 text-sm">
        <h2 className="font-semibold text-gray-900 mb-3">Tổng tiền</h2>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>

          <div className="flex justify-between">
            <span>Giảm giá</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>

          <div className="border-t border-dashed my-2" />

          <div className="flex justify-between text-base font-semibold">
            <span>Tổng cộng</span>
            <span className="text-emerald-600">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
