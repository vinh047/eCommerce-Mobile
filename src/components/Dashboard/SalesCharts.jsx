// src/components/Dashboard/SalesCharts.jsx
const brandDistribution = [
  { name: "iPhone", color: "bg-blue-500", percentage: 45 },
  { name: "Samsung", color: "bg-green-500", percentage: 32 },
  { name: "Xiaomi", color: "bg-purple-500", percentage: 15 },
  { name: "Khác", color: "bg-orange-500", percentage: 8 },
];

export default function SalesCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Doanh thu 7 ngày qua
          </h3>
          <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>7 ngày</option>
            <option>30 ngày</option>
            <option>3 tháng</option>
          </select>
        </div>
        <div className="chart-container">
          <div className="chart-overlay flex items-center justify-center">
            <div className="text-white text-center">
              <i className="fas fa-chart-line text-4xl mb-2 opacity-80"></i>
              <p className="text-lg font-semibold">₫312.5M</p>
              <p className="text-sm opacity-80">Tổng doanh thu tuần</p>
            </div>
          </div>
          {/* Placeholder for actual Chart component (e.g., Recharts, Chart.js) */}
        </div>
      </div>

      {/* Brand Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Phân bổ thương hiệu
        </h3>
        <div className="space-y-4">
          {brandDistribution.map((brand, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${brand.color} rounded-full`}></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {brand.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${brand.color} h-2 rounded-full`}
                    style={{ width: `${brand.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {brand.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
