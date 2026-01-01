"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import usersApi from "@/lib/api/usersApi";
import ReviewModal from "./ReviewModal"; // ✅ Đúng
import ordersApi from "@/lib/api/ordersApi";

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

  // ⭐ STATE CHO MODAL REVIEW
  const [openReview, setOpenReview] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const [openWarranty, setOpenWarranty] = useState(false);
  const [warrantyData, setWarrantyData] = useState(null);

  // ⭐ Hàm mở modal
  const openModal = (item) => {
    setReviewData({
      productId: item.productId,
      orderItemId: item.id,
      productName: item.nameSnapshot,
    });
    setOpenReview(true);
  };

  const handleOpenWarranty = (item) => {
    setWarrantyData({
      orderId: order.id, // Cần ID đơn hàng
      orderItemId: item.id, // Cần ID dòng sản phẩm (quan trọng nhất)
      productName: item.nameSnapshot,
      quantity: item.quantity,
      price: item.price,
    });
    setOpenWarranty(true);
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const user = await usersApi.getCurrentUser();

        if (cancelled) return;

        if (!user?.id) {
          setError(
            "Bạn chưa đăng nhập hoặc không lấy được thông tin tài khoản."
          );
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
        <Link
          href="/profile/orders"
          className="text-xs text-blue-600 hover:underline"
        >
          ← Quay lại danh sách đơn hàng
        </Link>
        Đang tải chi tiết đơn hàng...
      </div>
    );

  // Error
  if (error || !order)
    return (
      <div className="space-y-4">
        <Link
          href="/profile/orders"
          className="text-xs text-blue-600 hover:underline"
        >
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
    transaction?.methodName || transaction?.methodCode || "Không có thông tin";

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/profile/orders"
        className="text-xs text-blue-600 hover:underline"
      >
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

      {/* Items */}
      <section className="rounded-xl border bg-white overflow-hidden text-sm">
        <div className="border-b bg-gray-50 px-5 py-3 font-semibold">
          Sản phẩm
        </div>

        <div className="divide-y">
          {order?.items.map((item) => {
            const unitPrice = Number(item.price);
            const lineTotal = unitPrice * item.quantity;
            const review = item.review || null;

            // 4️⃣ Kiểm tra xem item này đã có yêu cầu bảo hành nào chưa (Nếu API có trả về)
            // Giả sử API trả về mảng rmas trong item: const rmas = item.rmas || [];
            // const isWarrantyPending = rmas.length > 0;

            return (
              <div key={item.id} className="px-5 py-3">
                <div className="flex justify-between">
                  {/* ... (Giữ nguyên phần hiển thị thông tin sản phẩm) ... */}
                  <div>
                    <div className="font-medium">{item.nameSnapshot}</div>
                    {item.variantColor && (
                      <div className="text-xs text-gray-500">
                        Màu: {item.variantColor}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Số lượng: {item.quantity}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(lineTotal)}
                    </div>
                  </div>
                </div>

                {/* --- KHU VỰC THAO TÁC (REVIEW & BẢO HÀNH) --- */}
                <div className="mt-3 ml-2 border-l pl-3 space-y-3">
                  {/* Logic Đánh giá (Review) - Giữ nguyên */}
                  <div>
                    {review ? (
                      <div className="text-sm">
                        <div className="font-semibold text-emerald-600">
                          Bạn đã đánh giá {review.stars} ★
                        </div>
                        <div className="text-gray-700 truncate max-w-md">
                          {review.content}
                        </div>
                      </div>
                    ) : order.status === "completed" ? (
                      <button
                        className="text-xs font-medium text-blue-600 hover:underline hover:text-blue-800 flex items-center gap-1"
                        onClick={() => openModal(item)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          ></path>
                        </svg>
                        Viết đánh giá
                      </button>
                    ) : null}
                  </div>

                  {/* 5️⃣ Logic Bảo hành (Warranty) - MỚI THÊM */}
                  {order.status === "completed" && (
                    <div>
                      <button
                        className="text-xs font-medium text-orange-600 hover:underline hover:text-orange-800 flex items-center gap-1 cursor-pointer"
                        onClick={() => handleOpenWarranty(item)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          ></path>
                        </svg>
                        Yêu cầu bảo hành / Đổi trả
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        open={openReview}
        onClose={() => setOpenReview(false)}
        productId={reviewData?.productId}
        orderItemId={reviewData?.orderItemId}
        productName={reviewData?.productName}
        onSubmitted={() => window.location.reload()}
      />

      <WarrantyModal
        isOpen={openWarranty}
        onClose={() => setOpenWarranty(false)}
        // Truyền thẳng object warrantyData vào prop 'order' hoặc tách lẻ ra tuỳ cách bạn viết Modal
        order={{
          id: warrantyData?.orderId,
          code: order.code, // Lấy code từ order cha
          items: [
            // Giả lập cấu trúc items để modal hiển thị đúng 1 sản phẩm đang chọn
            {
              id: warrantyData?.orderItemId,
              nameSnapshot: warrantyData?.productName,
              quantity: warrantyData?.quantity,
              price: warrantyData?.price,
            },
          ],
        }}
      />
    </div>
  );
}

function WarrantyModal({ isOpen, onClose, order }) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // Reset form khi mở modal mới
  useEffect(() => {
    if (isOpen) {
      // Nếu order chỉ có 1 sản phẩm (trường hợp mở từ trang chi tiết), tự chọn luôn
      if (order?.items?.length === 1) {
        setSelectedItemId(order.items[0].id);
      } else {
        setSelectedItemId(null);
      }
      setReason("");
      setMsg(null);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const orderItems = order.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); // Reset msg cũ

    if (!selectedItemId) {
      setMsg({ type: "error", text: "Vui lòng chọn sản phẩm cần bảo hành." });
      return;
    }
    if (!reason.trim()) {
      setMsg({ type: "error", text: "Vui lòng nhập lý do bảo hành." });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        orderId: order.id,
        orderItemId: Number(selectedItemId),
        type: "warranty",
        reason: reason,
        // evidenceJson: ... (thêm logic upload ảnh ở đây nếu cần sau này)
      };

      // ✅ 2. GỌI API THẬT
      await ordersApi.requestWarranty(payload);

      setMsg({
        type: "success",
        text: "Gửi yêu cầu bảo hành thành công! Admin sẽ liên hệ sớm.",
      });

      // Đóng modal sau 1.5s để user kịp đọc thông báo
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      // Lấy message lỗi từ API trả về (nếu có) hoặc hiển thị lỗi mặc định
      const errorText = error.message || "Có lỗi xảy ra, vui lòng thử lại.";
      setMsg({ type: "error", text: errorText });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900">Yêu cầu bảo hành</h3>
        <p className="text-sm text-gray-500 mb-4">Mã đơn hàng: {order.code}</p>

        {msg && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              msg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chọn sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn sản phẩm:
            </label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)} // Cho phép click vào cả dòng để chọn
                    className={`flex items-start gap-3 p-2 rounded cursor-pointer border border-transparent transition-colors ${
                      selectedItemId === item.id 
                        ? "bg-blue-50 border-blue-200" 
                        : "hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rma_item"
                      id={`item-${item.id}`}
                      value={item.id}
                      checked={selectedItemId === item.id}
                      onChange={(e) => setSelectedItemId(Number(e.target.value))}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <span className="font-medium block text-gray-900">
                        {item.nameSnapshot}
                      </span>
                      <span className="text-gray-500 text-xs">
                        SL: {item.quantity} - {formatCurrency(item.price)}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-2">
                  Không tìm thấy thông tin sản phẩm.
                </p>
              )}
            </div>
          </div>

          {/* Lý do */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do bảo hành / Mô tả lỗi: <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
              rows={3}
              placeholder="Mô tả chi tiết lỗi sản phẩm (VD: Màn hình bị sọc, sạc không vào điện...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
