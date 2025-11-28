"use client";

import React from "react";
import PaymentMethodList from "./_components/PaymentMethodList";
import OrderNote from "./_components/OrderNote";
import OrderSummarySidebar from "./_components/OrderSummarySidebar";
import BankTransferPanel from "./_components/BankTransferPanel";

export default function CheckoutStep2({
  items,
  subtotal,
  shippingFee,
  total,
  estimatingShipping,
  paymentMethods,
  selectedPaymentMethodId,
  onSelectPaymentMethodId,
  note,
  onChangeNote,

  // ✅ Coupon (auto apply best)
  appliedCoupon, // coupon đang được áp dụng
  allCoupons, // các coupon hợp lệ khác
  onSelectCoupon, // khi user chọn 1 coupon khác
  onRemoveCoupon, // khi user bỏ coupon

  requiresPaymentConfirmation,
  qrUrl,
  orderCode,
  isPaid,
  generatingQr,
  setIsPaid,
  placeOrderDisabled,
  submitting,
  onPlaceOrder,
  onBackToInfo,
  customer,
  chosenAddress,
}) {
  const selectedMethod = paymentMethods.find(
    (m) => m.id === selectedPaymentMethodId
  );

  const discount = appliedCoupon
    ? Number(
        appliedCoupon.discountAmount ?? appliedCoupon.computedDiscount ?? 0
      )
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cột trái: phương thức thanh toán + ghi chú */}
      <div className="lg:col-span-2 space-y-6">
        <PaymentMethodList
          paymentMethods={paymentMethods}
          selectedPaymentMethodId={selectedPaymentMethodId}
          onSelect={onSelectPaymentMethodId}
        />

        {/* Bank transfer + VietQR */}
        {selectedMethod && selectedMethod.code === "bank_transfer" && (
          <BankTransferPanel
            method={selectedMethod}
            total={total}
            generatingQr={generatingQr}
            qrUrl={qrUrl}
            orderCode={orderCode}
          />
        )}

        <OrderNote note={note} onChangeNote={onChangeNote} />
      </div>

      {/* Cột phải: tóm tắt + coupon + Đặt hàng */}
      <OrderSummarySidebar
        items={items}
        subtotal={subtotal}
        shippingFee={shippingFee}
        estimatingShipping={estimatingShipping}
        discount={discount}
        total={total}
        appliedCoupon={appliedCoupon}
        allCoupons={allCoupons}
        onSelectCoupon={onSelectCoupon}
        onRemoveCoupon={onRemoveCoupon}
        placeOrderDisabled={placeOrderDisabled}
        submitting={submitting}
        requiresPaymentConfirmation={requiresPaymentConfirmation}
        isPaid={isPaid}
        onPlaceOrder={onPlaceOrder}
        onBackToInfo={onBackToInfo}
        customer={customer}
        shippingAddress={chosenAddress} 
        items={items}
      />
    </div>
  );
}
