export default function ProductsHeader({ onCreateProduct, onExportCSV }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý điện thoại và phụ kiện</p>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onExportCSV}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <i className="fas fa-download mr-2"></i>Xuất CSV
        </button>
        <button 
          onClick={onCreateProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <i className="fas fa-plus mr-2"></i>Tạo sản phẩm
        </button>
      </div>
    </div>
  )
}