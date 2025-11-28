import { useState } from "react";
import { Button } from "@/components/ui/form/Button";
import CouponBox from "./CouponBox";
import SummaryRow from "./SummaryRow";
import { formatCurrency } from "../../CheckoutStep1/utils/utils";

export default function OrderSummarySidebar({
  items,
  subtotal,
  shippingFee,
  estimatingShipping,
  discount,
  total,

  appliedCoupon,
  allCoupons,
  onSelectCoupon,
  onRemoveCoupon,

  placeOrderDisabled,
  submitting,
  requiresPaymentConfirmation,
  isPaid,
  onPlaceOrder,
  onBackToInfo,

  // 👇 thêm 3 props
  customer,
  shippingAddress, // object address hoặc null nếu nhận tại cửa hàng
  deliveryMethod, // "pickup" | "shipping"
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClickPlaceOrder = () => {
    if (requiresPaymentConfirmation) {
      setShowConfirmModal(true);
    } else {
      onPlaceOrder();
    }
  };

  const handleConfirmAndPlace = () => {
    setShowConfirmModal(false);
    onPlaceOrder();
  };

  // ====== helper build địa chỉ text ======
  const shippingAddressText =
    deliveryMethod === "pickup"
      ? "Nhận tại cửa hàng — 273 An Dương Vương, P. Chợ Quán, Q.5, TP.HCM"
      : shippingAddress
      ? [
          shippingAddress.line,
          shippingAddress.ward,
          shippingAddress.district,
          shippingAddress.province,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

  return (
    <div className="space-y-4">
      {/* 🥇 TÓM TẮT ĐƠN HÀNG */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>

        <div className="space-y-3">
          <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
          <SummaryRow
            label="Phí vận chuyển"
            value={
              estimatingShipping
                ? "Đang ước tính..."
                : formatCurrency(shippingFee)
            }
          />

          <CouponBox
            appliedCoupon={appliedCoupon}
            allCoupons={allCoupons}
            onSelectCoupon={onSelectCoupon}
            onRemoveCoupon={onRemoveCoupon}
          />

          <SummaryRow label="Giảm giá" value={formatCurrency(discount)} />
          <div className="h-px bg-gray-200 my-2" />
          <SummaryRow label="Tổng cộng" value={formatCurrency(total)} strong />
        </div>
      </div>

      {/* 🥈 THÔNG TIN NHẬN HÀNG */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Thông tin nhận hàng
        </h3>

        <div className="space-y-1 text-sm text-gray-700">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Họ tên</span>
            <span className="font-medium text-right">
              {customer?.name || "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Số điện thoại</span>
            <span className="font-medium text-right">
              {shippingAddress?.phone || "—"}
            </span>
          </div>
          <div className="mt-2">
            <div className="text-gray-500">Địa chỉ nhận hàng</div>
            <div className="mt-1 text-sm font-medium text-gray-900">
              {shippingAddressText || "Chưa chọn địa chỉ"}
            </div>
          </div>
        </div>
      </div>

      {/* 🥉 DANH SÁCH SẢN PHẨM */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm</h3>

        <ul className="space-y-3">
          {items.map((it) => {
            // 👇 build url ảnh với base /assets/products/
            const rawImage =
              it.imageUrl || it.thumbnail || it.image || it.mainImage;
            const imageUrl = rawImage
              ? rawImage.startsWith("http")
                ? rawImage
                : `/assets/products/${rawImage}`
              : null;

            return (
              <li key={it.variantId} className="flex gap-3">
                <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {it.name}
                    {it.variantName && ` — ${it.variantName}`}
                  </div>
                  {Array.isArray(it.specs) && it.specs.length > 0 && (
                    <div className="text-xs text-gray-500 truncate">
                      {it.specs.filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>

                <div className="text-right text-sm flex-shrink-0">
                  <div className="text-gray-500">
                    Số lượng:{" "}
                    <span className="font-medium">{it.quantity}</span>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(it.price * it.quantity)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* BUTTONS */}
      <Button
        primary
        size="lg"
        fullWidth
        disabled={placeOrderDisabled}
        loading={submitting}
        onClick={handleClickPlaceOrder}
      >
        {submitting ? "Đang xử lý..." : "Đặt hàng"}
      </Button>

      {requiresPaymentConfirmation && (
        <div className="text-sm text-gray-500 mt-2">
          Vui lòng chuyển khoản qua VietQR trước, sau đó nhấn{" "}
          <strong>"Đặt hàng"</strong> để xác nhận và tạo đơn.
        </div>
      )}

      <Button size="lg" outline fullWidth onClick={onBackToInfo}>
        Quay lại nhập thông tin
      </Button>

      {requiresPaymentConfirmation && showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5">
            <h4 className="text-base font-semibold text-gray-900">
              Xác nhận đã chuyển khoản
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Vui lòng chỉ nhấn{" "}
              <strong>&quot;Xác nhận &amp; Đặt hàng&quot;</strong> sau khi bạn
              đã chuyển khoản thành công theo hướng dẫn VietQR.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                outline
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                primary
                onClick={handleConfirmAndPlace}
                loading={submitting}
              >
                Xác nhận &amp; Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
