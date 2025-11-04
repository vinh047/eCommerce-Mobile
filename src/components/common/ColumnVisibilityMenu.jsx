import { LayoutDashboard } from "lucide-react";

export function ColumnVisibilityMenu({
  columnVisibility,
  showColumnFilter,
  toggleColumnFilter,
  handleColumnVisibilityChange,
  columnLabels = {},
}) {
  return (
    <div className="relative">
      <button
        onClick={toggleColumnFilter}
        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
      >
        <LayoutDashboard className="w-5 h-5" />{" "}
      </button>

      {showColumnFilter && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-3 space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Hiển thị cột
            </div>
            {Object.entries(columnVisibility).map(([column, visible]) => (
              <label key={column} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) =>
                    handleColumnVisibilityChange(column, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm dark:text-white capitalize">
                  {columnLabels[column] || column}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
