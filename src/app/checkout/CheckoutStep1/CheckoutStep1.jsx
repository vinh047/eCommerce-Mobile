"use client";

import React from "react";
import Step1SummaryCard from "./_components/Step1SummaryCard";
import CustomerInfoForm from "./_components/CustomerInfoForm";
import AddressSection from "./_components/AddressSection";
import CheckoutProductSummary from "./_components/CheckoutProductSummary";

const HCMC_PROVINCE = "Hồ Chí Minh";

export default function CheckoutStep1({
  items,
  customer,
  onChangeCustomer,
  addresses,
  selectedAddressId,
  onSelectAddressId,
  addressForm,
  onChangeAddressForm,
  onSaveAddress,
  savingAddress,
  subtotal,
  total,
  shippingFee,
  estimatingShipping,
  showReviewItems,
  onToggleReviewItems,
  onContinue,
  onResetNewAddress, // optional: reset form khi không có địa chỉ
  onResetAddressToDefault, // optional: reset về địa chỉ mặc định khi đang nhập địa chỉ mới
  deliveryMethod,
  onChangeDeliveryMethod,
}) {
  const firstItem = items[0] || null;
  const otherItems = items.slice(1);

  return (
    <div className="space-y-6">
      {/* Sản phẩm */}
      <CheckoutProductSummary
        items={items}
        firstItem={firstItem}
        otherItems={otherItems}
        showOthers={showReviewItems}
        onToggleOthers={onToggleReviewItems}
      />

      {/* Thông tin khách hàng */}
      <CustomerInfoForm customer={customer} onChange={onChangeCustomer} />

      {/* Địa chỉ nhận hàng */}
      <AddressSection
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddressId={onSelectAddressId}
        addressForm={addressForm}
        onChangeAddressForm={onChangeAddressForm}
        onSaveAddress={onSaveAddress}
        savingAddress={savingAddress}
        onResetNewAddress={onResetNewAddress}
        onResetAddressToDefault={onResetAddressToDefault}
        deliveryMethod={deliveryMethod}
        onChangeDeliveryMethod={onChangeDeliveryMethod}
      />

      {/* Tóm tắt + hành động */}
      <Step1SummaryCard
        items={items}
        total={total}
        shippingFee={shippingFee}
        estimatingShipping={estimatingShipping}
        showReviewItems={showReviewItems}
        onToggleReviewItems={onToggleReviewItems}
        onContinue={onContinue}
      />
    </div>
  );
}

/* ---------- Sub components cho Step 1 ---------- */
