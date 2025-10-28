"use client";

export default function UsersTableSkeleton() {
  const fakeCols = ["ID", "Tên người dùng", "Email", "Trạng thái", "Ngày tạo"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex flex-nowrap space-y-2">
          <div className="h-6 w-80 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {fakeCols.map((col) => (
                <th key={col} className="px-6 py-3 text-left">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                {fakeCols.map((col, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
