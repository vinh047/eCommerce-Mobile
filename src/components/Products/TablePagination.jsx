export default function TablePagination({ 
  currentPage, 
  pageSize, 
  totalItems, 
  onPageChange, 
  onPageSizeChange 
}) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Hiển thị {startItem} - {endItem} của {totalItems} sản phẩm
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Số dòng:</label>
          <select 
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
        >
          <i className="fas fa-chevron-left mr-1"></i>Trước
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1" id="pagination">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  page === currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
        >
          Sau<i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  )
}