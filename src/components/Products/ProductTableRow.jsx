import { Edit, Eye, Trash } from "lucide-react"

const productImageClasses = [
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-red-500',
  'bg-gradient-to-br from-blue-400 to-cyan-500',
  'bg-gradient-to-br from-pink-500 to-yellow-400',
  'bg-gradient-to-br from-teal-300 to-pink-300'
]

export default function ProductTableRow({ 
  product, 
  columnVisibility, 
  isSelected, 
  onSelect, 
  onQuickView, 
  onEdit, 
  onDelete 
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
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

  const getImageClass = (index) => {
    return productImageClasses[index % productImageClasses.length]
  }

  return (
    <tr className="table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      
      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
          {product.id}
        </td>
      )}
      
      {columnVisibility.name && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getImageClass(parseInt(product.id.slice(-1)))} rounded-lg flex items-center justify-center`}>
              <i className="fas fa-mobile-alt text-white"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku || product.id.replace('PRD', 'SKU')}</div>
            </div>
          </div>
        </td>
      )}
      
      {columnVisibility.brand && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          {product.brand}
        </td>
      )}
      
      {columnVisibility.category && (
        <td className="px-6 py-4">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
            {product.category}
          </span>
        </td>
      )}
      
      {columnVisibility.rating && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-yellow-400 text-sm">
              {generateStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </td>
      )}
      
      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span className={`px-2 py-1 text-xs rounded ${
            product.isActive 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
          }`}>
            {product.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
          </span>
        </td>
      )}
      
      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
          {formatDate(product.createdAt)}
        </td>
      )}
      
      <td className="px-1 py-4">
        <div className="">
          <button 
            onClick={onQuickView}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400" 
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={onEdit}
            className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400" 
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800" 
            title="Xóa"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}