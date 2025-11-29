export default function CartMobileCheckout({ total, onCheckout }) {
  return (
    <div className="sticky-checkout lg:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Tổng cộng:</span>
          <span className="font-bold text-lg text-blue-600">{total}</span>
        </div>
        <button 
          onClick={onCheckout}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-2xl hover:bg-blue-700 focus-ring font-semibold transition-colors"
          aria-label="Tiến hành thanh toán"
        >
          Đến thanh toán
        </button>
      </div>
    </div>
  )
}