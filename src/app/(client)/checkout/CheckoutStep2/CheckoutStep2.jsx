// components/Checkout/CheckoutStep2.jsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/form/Button";
import { formatCurrency } from "../CheckoutStep1/utils/utils";
import PaymentMethodList from "./_components/PaymentMethodList";
import OrderNote from "./_components/OrderNote";
import BankTransferPanel from "./_components/BankTransferPanel";
import CouponBox from "./_components/CouponBox";
import { ChevronLeft, ShieldCheck, Ticket, Edit3, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";

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

  // Coupon props
  appliedCoupon,
  allCoupons,
  onSelectCoupon,
  onRemoveCoupon,

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showItems, setShowItems] = useState(false); // State để đóng/mở danh sách sản phẩm

  const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethodId);
  
  const discount = appliedCoupon
    ? Number(appliedCoupon.discountAmount ?? appliedCoupon.computedDiscount ?? 0)
    : 0;

  const handleClickPlaceOrder = () => {
    if (requiresPaymentConfirmation) {
      setShowConfirmModal(true);
    } else {
      onPlaceOrder();
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* CARD CHÍNH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Review nhanh: Giao tới đâu */}
        <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <p className="text-sm text-gray-500">Giao tới:</p>
              <p className="font-semibold text-gray-900">{customer?.name} ({chosenAddress?.phone})</p>
              <p className="text-sm text-gray-600 truncate max-w-md">
                 {chosenAddress ? `${chosenAddress.line}, ${chosenAddress.ward}, ${chosenAddress.district}` : "Nhận tại cửa hàng"}
              </p>
           </div>
           <Button size="sm" ghost onClick={onBackToInfo} className="text-blue-600 hover:bg-blue-50">
              <Edit3 className="w-4 h-4 mr-2"/> Thay đổi
           </Button>
        </div>

        {/* --- MỚI: ACCORDION XEM LẠI SẢN PHẨM --- */}
        <div className="border-b border-gray-100">
           <button 
             onClick={() => setShowItems(!showItems)}
             className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left cursor-pointer"
           >
              <div className="flex items-center gap-3">
                 <ShoppingCart className="w-5 h-5 text-blue-600" />
                 <span className="font-semibold text-gray-900">
                    Danh sách sản phẩm ({items.length})
                 </span>
                 <span className="text-sm text-gray-500 font-normal">
                    {showItems ? "(Thu gọn)" : "(Nhấn để xem chi tiết)"}
                 </span>
              </div>
              {showItems ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
           </button>

           {/* List sản phẩm dropdown */}
           {showItems && (
             <div className="px-6 pb-6 bg-gray-50/30 animate-in slide-in-from-top-2 fade-in">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {items.map((item) => (
                      <div key={item.id} className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
                         {/* Ảnh */}
                         <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0 relative">
                            <img 
                               src={`/assets/products/${item.image}`} 
                               alt={item.name} 
                               className="w-full h-full object-cover"
                            />
                            <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md font-bold">
                               x{item.quantity}
                            </span>
                         </div>
                         
                         {/* Thông tin */}
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                               {[item.variantName, ...(item.specs || [])].filter(Boolean).join(" • ")}
                            </p>
                         </div>

                         {/* Giá */}
                         <div className="text-sm font-semibold text-gray-900 text-right">
                            {formatCurrency(item.price * item.quantity)}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        <div className="p-6 lg:p-10 space-y-10">
          
          {/* SECTION 1: PHƯƠNG THỨC THANH TOÁN */}
          <section>
            <PaymentMethodList
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onSelect={onSelectPaymentMethodId}
            />

            {selectedMethod?.code === "bank_transfer" && (
              <BankTransferPanel
                method={selectedMethod}
                total={total}
                generatingQr={generatingQr}
                qrUrl={qrUrl}
                orderCode={orderCode}
              />
            )}
          </section>

          <hr className="border-dashed border-gray-200" />

          {/* SECTION 2: ƯU ĐÃI & GHI CHÚ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <Ticket className="w-5 h-5 text-blue-600"/> Mã ưu đãi
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                   <CouponBox
                      appliedCoupon={appliedCoupon}
                      allCoupons={allCoupons}
                      onSelectCoupon={onSelectCoupon}
                      onRemoveCoupon={onRemoveCoupon}
                   />
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <Edit3 className="w-5 h-5 text-blue-600"/> Ghi chú đơn hàng
                </h3>
                <OrderNote note={note} onChangeNote={onChangeNote} />
             </div>
          </section>

          <hr className="border-dashed border-gray-200" />

          {/* SECTION 3: TỔNG KẾT & ACTION */}
          <section className="bg-blue-50/30 rounded-2xl p-6 border border-blue-100">
             <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                   <span>Tạm tính ({items.length} sản phẩm)</span>
                   <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                   <span>Phí vận chuyển</span>
                   <span>{estimatingShipping ? "Đang tính..." : formatCurrency(shippingFee)}</span>
                </div>
                {discount > 0 && (
                   <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatCurrency(discount)}</span>
                   </div>
                )}
                <div className="h-px bg-gray-200 my-1"/>
                <div className="flex justify-between items-center text-lg">
                   <span className="font-bold text-gray-800">Tổng thanh toán</span>
                   <span className="font-bold text-2xl text-blue-600">{formatCurrency(total)}</span>
                </div>
             </div>

             <div className="flex flex-col-reverse sm:flex-row gap-4">
                <Button 
                   size="lg" 
                   outline 
                   onClick={onBackToInfo} 
                   className="flex-1"
                >
                   <ChevronLeft className="w-4 h-4 mr-2"/> Quay lại
                </Button>
                
                <Button
                   size="lg"
                   primary
                   onClick={handleClickPlaceOrder}
                   disabled={placeOrderDisabled}
                   loading={submitting}
                   className="flex-[2] shadow-lg shadow-blue-200 text-lg"
                >
                   {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </Button>
             </div>

             <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Thông tin thanh toán được bảo mật tuyệt đối</span>
             </div>
          </section>

        </div>
      </div>

      {/* MODAL XÁC NHẬN CHUYỂN KHOẢN (Giữ nguyên) */}
      {requiresPaymentConfirmation && showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 m-4 scale-100 animate-in zoom-in-95 duration-200">
            <h4 className="text-lg font-bold text-gray-900 text-center mb-2">
              Xác nhận đã chuyển khoản?
            </h4>
            <p className="text-sm text-gray-600 text-center mb-6">
              Vui lòng đảm bảo bạn đã chuyển khoản thành công theo mã QR hoặc thông tin tài khoản trước khi xác nhận.
            </p>

            <div className="flex flex-col gap-3">
              <Button size="lg" primary onClick={() => { setShowConfirmModal(false); onPlaceOrder(); }} loading={submitting}>
                Tôi đã chuyển khoản xong
              </Button>
              <Button size="md" ghost onClick={() => setShowConfirmModal(false)}>
                Kiểm tra lại
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}