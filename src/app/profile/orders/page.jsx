"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ordersApi from "@/lib/api/ordersApi";

// --- CẤU HÌNH ---
const PAGE_SIZE = 5;

// Giả lập API call tạo RMA (Bạn cần thêm hàm này vào ordersApi thực tế của bạn)
// const createRma = async (data) => axios.post('/rmas', data);

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

// --- COMPONENT CON: BADGES ---
function OrderStatusBadge({ status }) {
  const map = {
    pending: {
      label: "Chờ xác nhận",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-blue-50 text-blue-700 border-blue-200",
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
      label: "Đã giao hàng",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-emerald-100 text-emerald-800 border-emerald-300", // Màu đậm hơn chút để nhấn mạnh thành công
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-gray-100 text-gray-600 border-gray-300",
    },
    returned: {
      label: "Đã trả hàng",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
    refunded: {
      label: "Đã hoàn tiền",
      className: "bg-pink-50 text-pink-700 border-pink-200",
    },
  };

  const cfg = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap min-w-[100px] ${cfg.className}`}
    >
      {/* Thêm chấm tròn nhỏ phía trước để nhìn chuyên nghiệp hơn */}
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${cfg.className.replace(
          "bg-",
          "bg-current opacity-60"
        )}`}
      ></span>
      {cfg.label}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const map = {
    pending: {
      label: "Chưa thanh toán",
      className: "bg-orange-50 text-orange-700 border-orange-200",
    },
    paid: {
      label: "Đã thanh toán",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    failed: {
      label: "Thất bại",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const cfg = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap min-w-[110px] ${cfg.className}`}
    >
      {status === "paid" ? (
        // Icon check cho trạng thái đã thanh toán
        <svg
          className="mr-1 h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      ) : (
        // Chấm tròn cho các trạng thái khác
        <span
          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${cfg.className.replace(
            "bg-",
            "bg-current opacity-60"
          )}`}
        ></span>
      )}
      {cfg.label}
    </span>
  );
}

// --- COMPONENT CON: MODAL BẢO HÀNH ---
function WarrantyModal({ isOpen, onClose, order }) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // Reset form khi mở modal mới
  useEffect(() => {
    if (isOpen) {
      setSelectedItemId(null);
      setReason("");
      setMsg(null);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Giả định order.items có dữ liệu. Nếu API getMyOrders chưa trả về items, bạn cần fetch chi tiết order tại đây.
  const orderItems = order.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // GỌI API TẠO RMA Ở ĐÂY
      // Cấu trúc body gửi lên server khớp với model Rma của bạn
      const payload = {
        orderId: order.id,
        orderItemId: Number(selectedItemId),
        type: "warranty", // Hoặc cho user chọn nếu muốn
        reason: reason,
        // evidenceJson: ... (nếu có upload ảnh)
      };

      // Ví dụ: await ordersApi.requestWarranty(payload);
      console.log("Submitting RMA:", payload);

      // Giả lập delay mạng
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMsg({
        type: "success",
        text: "Gửi yêu cầu bảo hành thành công! Admin sẽ liên hệ sớm.",
      });

      // Đóng modal sau 1.5s
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMsg({ type: "error", text: "Có lỗi xảy ra, vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900">Yêu cầu bảo hành</h3>
        <p className="text-sm text-gray-500 mb-4">Đơn hàng: {order.code}</p>

        {msg && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
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
                    className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer border-b last:border-0 border-gray-100"
                  >
                    <input
                      type="radio"
                      name="rma_item"
                      id={`item-${item.id}`}
                      value={item.id}
                      checked={selectedItemId === item.id}
                      onChange={(e) =>
                        setSelectedItemId(Number(e.target.value))
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <span className="font-medium block">
                        {item.nameSnapshot}
                      </span>
                      <span className="text-gray-500 text-xs">
                        x{item.quantity} - {formatCurrency(item.price)}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Không tìm thấy thông tin sản phẩm.
                </p>
              )}
            </div>
          </div>

          {/* Lý do */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do bảo hành / Mô tả lỗi:
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Ví dụ: Màn hình bị sọc, không lên nguồn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- TRANG CHÍNH ---
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

  // State cho Modal
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [selectedOrderForWarranty, setSelectedOrderForWarranty] =
    useState(null);

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
        if (!cancelled) setLoading(false);
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

  const handleOpenWarranty = (order) => {
    setSelectedOrderForWarranty(order);
    setWarrantyModalOpen(true);
  };
  console.log(orders)

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
      {/* Bảng đơn hàng */}
      <section className="rounded-xl bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-gray-500 border border-gray-200 rounded-xl">
            Đang tải danh sách đơn hàng...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600 border border-red-200 rounded-xl bg-red-50">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-gray-500 border border-gray-200 rounded-xl">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="min-w-full overflow-x-auto">
            {/* Thêm border-collapse để kẻ khung liền mạch */}
            <table className="min-w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {/* Thêm border cho từng thẻ th */}
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Mã đơn
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Ngày đặt
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Thanh toán
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">
                    Tổng tiền
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Cột Mã đơn */}
                    <td className="border border-gray-300 px-4 py-3 align-middle">
                      <div className="font-bold text-blue-600">
                        {order.code}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        ID: #{order.id}
                      </div>
                    </td>

                    {/* Cột Ngày đặt */}
                    <td className="border border-gray-300 px-4 py-3 align-middle text-gray-700 whitespace-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>

                    {/* Cột Trạng thái */}
                    <td className="border border-gray-300 px-4 py-3 align-middle text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Cột Thanh toán */}
                    <td className="border border-gray-300 px-4 py-3 align-middle text-center">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>

                    {/* Cột Tổng tiền */}
                    <td className="border border-gray-300 px-4 py-3 align-middle text-right font-bold text-gray-900 whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </td>

                    {/* Cột Thao tác (Đã sửa lại nút bấm cho đẹp) */}
                    <td className="border border-gray-300 px-4 py-3 align-middle text-center">
                      <div className="flex flex-col items-center gap-2">
                        {/* Nút Xem chi tiết */}
                        <Link
                          href={`/profile/orders/${order.id}`}
                          className="w-full min-w-[110px] rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
                        >
                          Xem chi tiết
                        </Link>

                        {/* Nút Bảo hành */}
                        {order.status === "completed" && (
                          <button
                            onClick={() => handleOpenWarranty(order)}
                            className="w-full min-w-[110px] rounded border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-all shadow-sm"
                          >
                            Yêu cầu bảo hành
                          </button>
                        )}
                      </div>
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

      {/* Render Modal */}
      <WarrantyModal
        isOpen={warrantyModalOpen}
        onClose={() => setWarrantyModalOpen(false)}
        order={selectedOrderForWarranty}
      />
    </div>
  );
}
