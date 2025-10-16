export default function LoadingSkeleton({ columnVisibility }) {
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i)

  return (
    <>
      {skeletonRows.map(index => (
        <tr key={index} className="table-row border-b border-gray-200 dark:border-gray-700">
          <td className="px-6 py-4">
            <div className="skeleton w-4 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
          </td>
          
          {columnVisibility.id && (
            <td className="px-6 py-4">
              <div className="skeleton w-16 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            </td>
          )}
          
          {columnVisibility.name && (
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="skeleton w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="skeleton w-32 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                  <div className="skeleton w-20 h-3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                </div>
              </div>
            </td>
          )}
          
          {columnVisibility.brand && (
            <td className="px-6 py-4">
              <div className="skeleton w-20 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            </td>
          )}
          
          {columnVisibility.category && (
            <td className="px-6 py-4">
              <div className="skeleton w-24 h-6 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            </td>
          )}
          
          {columnVisibility.rating && (
            <td className="px-6 py-4">
              <div className="skeleton w-20 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            </td>
          )}
          
          {columnVisibility.status && (
            <td className="px-6 py-4">
              <div className="skeleton w-16 h-6 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            </td>
          )}
          
          {columnVisibility.createdAt && (
            <td className="px-6 py-4">
              <div className="skeleton w-20 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            </td>
          )}
          
          <td className="px-6 py-4">
            <div className="skeleton w-24 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  )
}