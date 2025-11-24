"use client";

export default function TopProducts({ products = [] }) {
  const maxQty = Math.max(...products.map(p => p.quantity)) || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Sản Phẩm Bán Chạy</h3>
      <div className="space-y-6">
        {products.length === 0 && <p className="text-gray-500 text-sm">Chưa có dữ liệu.</p>}
        {products.map((product, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate w-3/4" title={product.name}>
                {index + 1}. {product.name}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{product.quantity} đã bán</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${(product.quantity / maxQty) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-right text-gray-500 mt-1">
               Doanh thu: {Number(product.revenue).toLocaleString()} ₫
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}