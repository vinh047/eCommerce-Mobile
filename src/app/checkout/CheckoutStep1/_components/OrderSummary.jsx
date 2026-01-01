// components/Checkout/OrderSummary.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../utils/utils"; 
import { Button } from "@/components/ui/form/Button"; 

export default function OrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  estimatingShipping,
  onContinue,
  step,
  loading, // state loading khi bấm nút
  disabled, // state disabled
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          Đơn hàng ({items.length} sản phẩm)
        </h3>
      </div>

      {/* Danh sách sản phẩm (Có thể thu gọn trên mobile) */}
      <div className="p-5">
        <div className={`space-y-4 ${!isExpanded ? "max-h-[280px] overflow-hidden relative" : ""}`}>
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-14 h-14 rounded-md border border-gray-100 bg-gray-50 overflow-hidden shrink-0 relative">
                <img
                  src={`/assets/products/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md font-medium">
                  x{item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {[item.variantName, ...(item.specs || [])].filter(Boolean).join(" • ")}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
          
          {/* Nút Xem thêm nếu danh sách dài */}
          {items.length > 3 && !isExpanded && (
             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-0">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-blue-600 font-medium hover:underline flex items-center bg-white px-2 rounded-full shadow-sm border"
                >
                  Xem tất cả <ChevronDown className="w-3 h-3 ml-1" />
                </button>
             </div>
          )}
           {items.length > 3 && isExpanded && (
             <button 
                onClick={() => setIsExpanded(false)}
                className="text-xs text-blue-600 font-medium hover:underline flex items-center mt-2 mx-auto"
              >
                Thu gọn <ChevronUp className="w-3 h-3 ml-1" />
              </button>
           )}
        </div>

        <hr className="my-5 border-dashed border-gray-200" />

        {/* Tính tiền */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            {estimatingShipping ? (
               <span className="italic text-gray-400">Đang tính...</span>
            ) : (
               <span className="font-medium text-gray-900">{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
            )}
          </div>
          {/* Chỗ để hiển thị mã giảm giá nếu cần */}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-800 text-base">Tổng cộng</span>
          <span className="font-bold text-2xl text-blue-600">{formatCurrency(total)}</span>
        </div>

        {/* Nút Action chính - Thay đổi text dựa theo Step */}
        <div className="mt-6">
           <Button
             primary
             size="lg"
             fullWidth
             onClick={onContinue}
             disabled={disabled || estimatingShipping}
             loading={loading}
             className="shadow-lg shadow-blue-100"
           >
             {step === 1 ? "Tiếp tục thanh toán" : "Đặt hàng ngay"}
           </Button>
           
           {step === 1 && (
             <p className="text-xs text-center text-gray-500 mt-3">
               Bạn sẽ được kiểm tra lại đơn hàng ở bước tiếp theo
             </p>
           )}
        </div>
      </div>
    </div>
  );
}