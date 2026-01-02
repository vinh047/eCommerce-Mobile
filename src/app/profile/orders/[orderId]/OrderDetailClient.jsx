"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import usersApi from "@/lib/api/usersApi";
import ReviewModal from "./ReviewModal";
import WarrantyModal from "../_components/WarrantyModal";

// Helper Formatter
const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );
const formatDate = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN") : "");

// Status Badge
function StatusBadge({ status }) {
  return (
    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
      {status}
    </span>
  );
}

// --- SKELETON ---
function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded"></div>
      <div>
        <div className="h-7 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-3"></div>
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-10 bg-gray-200 rounded"></div>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {/* Info Skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function OrderDetailClient({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewModal, setReviewModal] = useState({ open: false, data: null });
  const [warrantyModal, setWarrantyModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const user = await usersApi.getCurrentUser();
        const res = await fetch(`/api/orders/me/${orderId}?userId=${user.id}`);
        if (!res.ok) throw new Error("Lỗi tải đơn hàng");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [orderId]);

  if (loading) return <OrderDetailSkeleton />;

  if (error || !order)
    return (
      <div className="space-y-4 text-center py-10">
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 inline-block">
          {error || "Không tìm thấy đơn hàng"}
        </div>
        <div>
          <Link
            href="/profile/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );

  const { items, addressSnapshot, transactions } = order;
  const address = addressSnapshot?.address || {};
  const customer = addressSnapshot?.customer || {};
  const transaction = transactions?.[0];

  console.log(items);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/profile/orders"
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Danh sách đơn hàng
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          Chi tiết đơn #{order.code}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-semibold text-gray-900">
                Danh sách sản phẩm
              </h2>
              <span className="text-xs text-gray-500">{items.length} món</span>
            </div>

            <div className="divide-y divide-gray-50">
              {items.map((item) => {
                const productSlug = item.slug || item.productId;
                const productLink = `/san-pham/${productSlug}`;

                return (
                  <div key={item.id} className="p-6 flex gap-4 group">
                    <Link
                      href={productLink}
                      className="block relative w-20 h-20 shrink-0"
                    >
                      <div className="w-full h-full bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative transition-transform group-hover:scale-105">
                        {item.image ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_URL_IMAGE || ""}${
                              item.image
                            }`}
                            alt={item.nameSnapshot}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                            No Img
                          </div>
                        )}
                      </div>
                    </Link>
                    {/* -------------------------------------- */}

                    <div className="flex-1 min-w-0">
                      {/* --- 2. TÊN SẢN PHẨM (BỌC TRONG LINK) --- */}
                      <Link href={productLink}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                          {item.nameSnapshot}
                        </h3>
                      </Link>
                      {/* -------------------------------------- */}

                      {item.variantColor && (
                        <p className="text-xs text-gray-500 mt-1">
                          Phân loại: {item.variantColor}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-gray-500">x{item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      {order.status === "completed" && (
                        <div className="mt-3 flex gap-3">
                          {!item.review ? (
                            <button
                              onClick={() =>
                                setReviewModal({ open: true, data: item })
                              }
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> Viết
                              đánh giá
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-medium">
                              ★ Đã đánh giá {item.review.stars} sao
                            </span>
                          )}

                          <button
                            onClick={() =>
                              setWarrantyModal({ open: true, data: item })
                            }
                            className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Bảo hành
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Card Info */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Địa chỉ nhận hàng
              </h3>
              <div className="text-sm text-gray-600 space-y-1 ml-6">
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p>{address.phone}</p>
                <p>
                  {address.line}, {address.ward}
                </p>
                <p>
                  {address.district}, {address.province}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" /> Thanh toán
              </h3>
              <div className="text-sm text-gray-600 ml-6">
                <p>{transaction?.methodName || "Thanh toán khi nhận hàng"}</p>
                <p
                  className={`text-xs mt-1 font-medium ${
                    order.paymentStatus === "paid"
                      ? "text-emerald-600"
                      : "text-orange-600"
                  }`}
                >
                  {order.paymentStatus === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-600" /> Trạng thái đơn
              </h3>
              <div className="ml-6">
                <StatusBadge status={order.status} />
                <p className="text-xs text-gray-400 mt-2">
                  Cập nhật: {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Card Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>
                  {formatCurrency(order.total - (order.shippingFee || 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Tổng cộng</span>
              <span className="font-bold text-xl text-blue-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReviewModal
        open={reviewModal.open}
        onClose={() => setReviewModal({ ...reviewModal, open: false })}
        productId={reviewModal.data?.productId}
        orderItemId={reviewModal.data?.id}
        productName={reviewModal.data?.nameSnapshot}
        onSubmitted={() => window.location.reload()}
      />

      <WarrantyModal
        isOpen={warrantyModal.open}
        onClose={() => setWarrantyModal({ ...warrantyModal, open: false })}
        order={{ ...order, items: [warrantyModal.data] }}
      />
    </div>
  );
}
