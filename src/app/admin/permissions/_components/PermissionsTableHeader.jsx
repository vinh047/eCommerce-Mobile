// src/pages/permissions/_components/PermissionsTableHeader.jsx
export default function PermissionsTableHeader({
  columnVisibility,
  sortConfig,
  selectedItems,
  currentPagePermissions, // Thay vì coupons
  onSort,
  onSelectAll,
}) {
  // Lấy ID của các quyền hạn trên trang hiện tại
  const currentPageIds = currentPagePermissions.map((p) => p.id);
  // Kiểm tra trạng thái chọn tất cả/một phần
  const allSelected = currentPageIds.every((id) => selectedItems.has(id));
  const someSelected = currentPageIds.some((id) => selectedItems.has(id));

  // Logic hiển thị icon sắp xếp (giữ nguyên)
  const getSortIcon = (column) => {
    if (sortConfig.column !== column) {
      // Sử dụng className của font-awesome (giống file gốc)
      return "fas fa-sort text-gray-400";
    }
    return sortConfig.direction === "asc"
      ? "fas fa-sort-up text-blue-600"
      : "fas fa-sort-down text-blue-600";
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        {/* Checkbox chọn hàng loạt */}
        <th className="px-6 py-3 text-left">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = !allSelected && someSelected;
            }}
            onChange={onSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </th>

        {/* Cột ID */}
        {columnVisibility.id && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("id")}
          >
            <div className="flex items-center space-x-1">
              <span>ID</span>
              <i className={getSortIcon("id")}></i>
            </div>
          </th>
        )}

        {/* Cột Key */}
        {columnVisibility.key && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("key")}
          >
            <div className="flex items-center space-x-1">
              <span>Key (Khóa)</span>
              <i className={getSortIcon("key")}></i>
            </div>
          </th>
        )}

        {/* Cột Name */}
        {columnVisibility.name && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("name")}
          >
            <div className="flex items-center space-x-1">
              <span>Tên Quyền hạn</span>
              <i className={getSortIcon("name")}></i>
            </div>
          </th>
        )}

        {/* Cột Description */}
        {columnVisibility.description && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            <div className="flex items-center space-x-1">
              <span>Mô tả</span>
            </div>
          </th>
        )}

        {/* Cột CreatedAt */}
        {columnVisibility.createdAt && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("createdAt")}
          >
            <div className="flex items-center space-x-1">
              <span>Ngày tạo</span>
              <i className={getSortIcon("createdAt")}></i>
            </div>
          </th>
        )}

        {/* Cột Thao tác */}
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}
