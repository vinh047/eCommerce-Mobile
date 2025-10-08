import Link from 'next/link'

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2].map(index => (
          <div key={index} className="bg-white rounded-2xl custom-shadow p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl loading-skeleton"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded loading-skeleton w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded loading-skeleton w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded loading-skeleton w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl custom-shadow p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded loading-skeleton"></div>
            <div className="h-10 bg-gray-200 rounded-2xl loading-skeleton"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded loading-skeleton"></div>
              <div className="h-4 bg-gray-200 rounded loading-skeleton"></div>
              <div className="h-4 bg-gray-200 rounded loading-skeleton"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-2xl loading-skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="text-center py-12 empty-state">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
      <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
      <Link href="/" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 focus-ring font-medium transition-colors">
        Tiếp tục mua sắm
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  )
}

export function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
      <p className="text-gray-600 mb-6">Không thể tải giỏ hàng. Vui lòng thử lại sau.</p>
      <button 
        onClick={onRetry}
        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 focus-ring font-medium transition-colors"
      >
        Thử lại
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </button>
    </div>
  )
}