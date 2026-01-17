export default function CouponsTableHeader({
  columnVisibility,
  sortConfig,
  selectedItems,
  currentPageCoupons,
  totalItems,
  onSort,
  onSelectAll,
}) {
  const currentPageIds = currentPageCoupons.map((p) => p.id);
  const allSelected = currentPageIds.every((id) => selectedItems.has(id));
  const someSelected = currentPageIds.some((id) => selectedItems.has(id));

  const getSortIcon = (column) => {
    if (sortConfig.column !== column) {
      return "fas fa-sort text-gray-400";
    }
    return sortConfig.direction === "asc"
      ? "fas fa-sort-up text-blue-600"
      : "fas fa-sort-down text-blue-600";
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
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

        {columnVisibility.code && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("code")}
          >
            <div className="flex items-center space-x-1">
              <span>Mã giảm giá</span>
              <i className={getSortIcon("code")}></i>
            </div>
          </th>
        )}

        {columnVisibility.value && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("value")}
          >
            <div className="flex items-center space-x-1">
              <span>Giá trị</span>
              <i className={getSortIcon("value")}></i>
            </div>
          </th>
        )}

        {columnVisibility.type && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("type")}
          >
            <div className="flex items-center space-x-1">
              <span>Loại</span>
              <i className={getSortIcon("type")}></i>
            </div>
          </th>
        )}

        {columnVisibility.usageLimit && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            <div className="flex items-center space-x-1">
              <span>Lượt sử dụng</span>
            </div>
          </th>
        )}

        {columnVisibility.status && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("status")}
          >
            <div className="flex items-center space-x-1">
              <span>Trạng thái</span>
              <i className={getSortIcon("status")}></i>
            </div>
          </th>
        )}

        {columnVisibility.endsAt && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onSort("endsAt")}
          >
            <div className="flex items-center space-x-1">
              <span>Hết hạn</span>
              <i className={getSortIcon("endsAt")}></i>
            </div>
          </th>
        )}

        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}
