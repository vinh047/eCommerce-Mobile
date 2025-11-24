import { formatPrice } from '@/utils/format'

export default function CartSummary({ 
  subtotal, 
  discount = 0, 
  shipping = 0, 
  onApplyCoupon, 
  onCheckout 
}) {
  return (
    <div className="space-y-4 sticky top-20 h-fit">
      {/* Order Summary */}
      <div className="bg-white rounded-2xl custom-shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
        
        <div className="space-y-3" aria-live="polite" aria-label="Tóm tắt đơn hàng">
          
          <hr className="border-gray-200"/>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Tạm tính</span>
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