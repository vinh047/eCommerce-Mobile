import { formatPrice } from '@/utils/format'

export default function CartSummary({ 
  subtotal, 
  discount = 0, 
  shipping = 0, 
  onApplyCoupon, 
  onCheckout 
}) {
  return (
    <div className="space-y-4">
      {/* Coupon Input */}
      <div className="bg-white rounded-2xl custom-shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Mã giảm giá</h3>
        <form onSubmit={onApplyCoupon} className="space-y-3">
          <div className="relative">
            <input 
              type="text" 
              id="couponInput"
              placeholder="Nhập mã giảm giá"
              aria-label="Nhập mã giảm giá"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus-ring focus:border-blue-600"
            />
            <div id="couponError" className="hidden mt-2 text-sm text-red-600" role="alert"></div>
            <div id="couponSuccess" className="hidden mt-2 text-sm text-green-600" role="alert"></div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl hover:bg-gray-200 focus-ring font-medium transition-colors"
            aria-label="Áp dụng mã giảm giá"
          >
            Áp dụng
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl custom-shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
        
        <div className="space-y-3" aria-live="polite" aria-label="Tóm tắt đơn hàng">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
          </div>
          
          <hr className="border-gray-200"/>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-blue-600">{formatPrice(subtotal - discount + shipping)}</span>
          </div>
        </div>
        
        {/* Checkout Button */}
        <button 
          onClick={onCheckout}
          className="w-full mt-6 bg-blue-600 text-white py-4 px-6 rounded-2xl hover:bg-blue-700 focus-ring font-semibold text-lg transition-colors"
          aria-label="Tiến hành thanh toán"
        >
          Đến thanh toán
        </button>
        
        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Thanh toán an toàn & bảo mật
        </div>
      </div>
    </div>
  )
}