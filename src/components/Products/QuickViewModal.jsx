'use client'

const productImageClasses = [
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-red-500',
  'bg-gradient-to-br from-blue-400 to-cyan-500',
  'bg-gradient-to-br from-pink-500 to-yellow-400',
  'bg-gradient-to-br from-teal-300 to-pink-300'
]

export default function QuickViewModal({ product, onClose, onEdit, onDuplicate }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getImageClass = (productId) => {
    const index = parseInt(productId.slice(-1)) || 0
    return productImageClasses[index % productImageClasses.length]
  }

  const generateStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>)
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>)
    }
    
    return stars
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Slide Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chi tiết sản phẩm</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto pb-24">
          {/* Product Image & Basic Info */}
          <div className="flex items-start space-x-6 mb-8">
            <div className={`w-24 h-24 ${getImageClass(product.id)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <i className="fas fa-mobile-alt text-white text-2xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>ID: {product.id}</span>
                <span>SKU: {product.sku || product.id.replace('PRD', 'SKU')}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.brand}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${
                  product.isActive 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {product.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Danh mục</h4>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                {product.category}
              </span>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Đánh giá</h4>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{product.rating}</div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  {generateStars(product.rating)}
                </div>
                <span className="text-gray-600 dark:text-gray-400">({product.reviewCount} đánh giá)</span>
              </div>
            </div>

            {/* Date Created */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ngày tạo</h4>
              <p className="text-gray-900 dark:text-white">{formatDate(product.createdAt)}</p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả</h4>
                <p className="text-gray-900 dark:text-white">{product.description}</p>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Đánh giá gần đây</h4>
              <div className="space-y-4">
                {/* Sample reviews */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">N</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Nguyễn Văn A</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">15/11/2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Trả lời</button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">Ẩn</button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Sản phẩm rất tốt, chất lượng như mong đợi. Giao hàng nhanh, đóng gói cẩn thận. 
                    Sẽ tiếp tục ủng hộ shop!
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">T</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Trần Thị B</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">14/11/2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Trả lời</button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">Ẩn</button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Máy đẹp, chạy mượt. Tuy nhiên giá hơi cao so với thị trường. 
                    Nhìn chung vẫn hài lòng với sản phẩm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-end space-x-3">
            <button 
              onClick={onDuplicate}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <i className="fas fa-copy mr-2"></i>Nhân bản
            </button>
            <button 
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <i className="fas fa-edit mr-2"></i>Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}