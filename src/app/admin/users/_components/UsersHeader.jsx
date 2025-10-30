export default function UsersHeader({ onCreateUser, onExportCSV }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Người dùng</h1>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onExportCSV}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <i className="fas fa-download mr-2"></i>Xuất Excel
        </button>
        <button 
          onClick={onCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <i className="fas fa-plus mr-2"></i>Tạo người dùng
        </button>
      </div>
    </div>
  )
}