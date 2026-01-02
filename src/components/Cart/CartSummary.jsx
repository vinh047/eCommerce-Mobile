// components/Cart/CartSummary.jsx
import { formatPrice } from "@/utils/format";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/form/Button";

export default function CartSummary({
  subtotal,
  discount = 0,
  shipping = 0,
  onCheckout,
  isDisabled,
  itemCount,
}) {
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
      <h3 className="font-bold text-gray-800 text-lg">Tóm tắt đơn hàng</h3>

      <hr className="border-gray-100" />

      {/* Summary Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính ({itemCount} sản phẩm)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Giảm giá</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span className="italic text-gray-400">Tính khi thanh toán</span>
        </div>
      </div>

      <hr className="border-dashed border-gray-200" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800 text-base">Tổng cộng</span>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 leading-none">
            {formatPrice(total)}
          </div>
          {/* Đã xóa dòng (Đã bao gồm VAT) */}
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        primary
        size="lg"
        fullWidth
        onClick={onCheckout}
        disabled={isDisabled}
        className="text-base shadow-lg shadow-blue-200"
      >
        Tiến hành đặt hàng
      </Button>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Bảo mật thanh toán 100%</span>
      </div>
    </div>
  );
}