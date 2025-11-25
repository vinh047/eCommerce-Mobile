// src/app/profile/orders/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ordersApi from "@/lib/api/ordersApi";


const PAGE_SIZE = 5;

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

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

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage =
    typeof pageParam === "string" && Number(pageParam) > 0
      ? Number(pageParam)
      : 1;

  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch danh sách đơn hàng
  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const res = await ordersApi.getMyOrders({
          page: currentPage.toString(),
          pageSize: PAGE_SIZE.toString(),
        });

        if (!cancelled) {
          setOrders(res.orders || []);
          setTotalItems(res.meta?.totalItems || 0);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
        if (!cancelled) {
          setError("Không thể tải danh sách đơn hàng.");
          setOrders([]);
          setTotalItems(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const goToPage = (page) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());
    router.push(`/profile/orders?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Đơn hàng của tôi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem lịch sử mua hàng và trạng thái đơn hàng.
          </p>
        </div>
        {totalItems > 0 && (
          <div className="text-xs text-gray-400">
            Tổng cộng <span className="font-semibold">{totalItems}</span> đơn
            hàng
          </div>
        )}
      </div>

      {/* Bảng đơn hàng */}
      <section className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Đang tải danh sách đơn hàng...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="min-w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Mã đơn
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Ngày đặt
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Thanh toán
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="font-medium text-gray-900">
                        {order.code}
                      </div>
                      <div className="text-xs text-gray-400">
                        #{order.id.toString().padStart(6, "0")}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-gray-700">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 align-middle text-right text-gray-900 font-semibold">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3 align-middle text-right">
                      <Link
                        href={`/profile/orders/${order.id}`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            Trang {currentPage} / {totalPages || 1}
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md border text-xs ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-default"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Trước
            </button>
            <button
              onClick={() =>
                currentPage < totalPages && goToPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-md border text-xs ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-300 cursor-default"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
