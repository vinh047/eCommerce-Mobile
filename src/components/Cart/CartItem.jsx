export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="cart-item bg-white rounded-2xl custom-shadow p-4" data-item-id={item.id}>
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className={`w-20 h-20 ${item.id === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-purple-100 to-purple-200'} rounded-2xl overflow-hidden`}>
            <div className="w-full h-full flex items-center justify-center">
              {item.id === 1 ? (
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
              ) : (
                <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15S15 13.66 15 12V4C15 2.34 13.66 1 12 1ZM12 3C12.55 3 13 3.45 13 4V12C13 12.55 12.55 13 12 13S11 12.55 11 12V4C11 3.45 11.45 3 12 3ZM12 17C8.69 17 6 14.31 6 11H4C4 15.42 7.58 19 12 19S20 15.42 20 11H18C18 14.31 15.31 17 12 17Z"/>
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{item.variant}</p>
          
          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-blue-600">{formatPrice(item.price)}</span>
              
              {/* Quantity Stepper */}
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button 
                  className="p-2 hover:bg-gray-50 focus-ring rounded-l-xl"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  aria-label={`Giảm số lượng ${item.name}`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{item.quantity}</span>
                <button 
                  className="p-2 hover:bg-gray-50 focus-ring rounded-r-xl"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  aria-label={`Tăng số lượng ${item.name}`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Remove Button */}
            <button 
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl focus-ring"
              onClick={() => onRemove(item.id)}
              aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          
          {/* Subtotal */}
          <div className="mt-2">
            <span className="text-sm text-gray-600">Thành tiền: </span>
            <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price).replace('₫', '₫');
}