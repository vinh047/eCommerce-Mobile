export default function BulkActionsBar({ 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onBulkAction, 
  show 
}) {
  if (!show) return null

  return (
    <div className={`
      bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
      rounded-lg p-4 mb-4 transition-transform duration-300
      ${show ? 'transform translate-y-0' : 'transform -translate-y-full'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            {selectedCount} sản phẩm được chọn
          </span>
          <button 
            onClick={onSelectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Chọn tất cả
          </button>
          <button 
            onClick={onDeselectAll}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Bỏ chọn
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onBulkAction('activate')}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            <i className="fas fa-eye mr-1"></i>Hiển thị
          </button>
          <button 
            onClick={() => onBulkAction('deactivate')}
            className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            <i className="fas fa-eye-slash mr-1"></i>Ẩn
          </button>
          <button 
            onClick={() => onBulkAction('category')}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            <i className="fas fa-tags mr-1"></i>Gán danh mục
          </button>
          <button 
            onClick={() => onBulkAction('delete')}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            <i className="fas fa-trash mr-1"></i>Xóa
          </button>
        </div>
      </div>
    </div>
  )
}