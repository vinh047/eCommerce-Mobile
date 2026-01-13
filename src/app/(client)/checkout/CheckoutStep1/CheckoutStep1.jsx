// components/Checkout/CheckoutStep1.jsx
"use client";

import React from "react";
import CustomerInfoForm from "./_components/CustomerInfoForm";
import AddressSection from "./_components/AddressSection";
import { User } from "lucide-react";
import OrderSummary from "./_components/OrderSummary";

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
  onResetNewAddress,
  deliveryMethod,
  onChangeDeliveryMethod,
  // Props cho Summary
  subtotal,
  total,
  shippingFee,
  estimatingShipping,
  onContinue,
}) {
  return (
    // Grid 2 cột: Form (8) - Summary (4)
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* --- CỘT TRÁI (FORM NHẬP LIỆU) --- */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          
          {/* Form Thông tin */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Thông tin người nhận
            </h3>
            <CustomerInfoForm customer={customer} onChange={onChangeCustomer} />
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Form Địa chỉ & Vận chuyển */}
          <AddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddressId={onSelectAddressId}
            addressForm={addressForm}
            onChangeAddressForm={onChangeAddressForm}
            onSaveAddress={onSaveAddress}
            savingAddress={savingAddress}
            onResetNewAddress={onResetNewAddress}
            deliveryMethod={deliveryMethod}
            onChangeDeliveryMethod={onChangeDeliveryMethod}
          />
        </div>
      </div>

      <div className="lg:col-span-4 sticky top-20">
        <OrderSummary
          items={items}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          estimatingShipping={estimatingShipping}
          onContinue={onContinue}
          step={1}
        />
      </div>
    </div>
  );
}