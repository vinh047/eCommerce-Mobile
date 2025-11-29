"use client";

import { useState } from "react";

export default function RevenueChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxRevenue = Math.max(...data.map(d => d.revenue)) || 1;

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Biểu đồ Doanh thu & Đơn hàng</h3>
        <div className="flex items-center gap-2 text-xs">
           <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-1"></div> Doanh thu</div>
        </div>
      </div>

      <div className="relative h-72 w-full flex items-end justify-between gap-2 px-2">
         {/* Grid Lines */}
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(6)].map((_, i) => <div key={i} className="border-t border-gray-100 dark:border-gray-700 w-full h-0"></div>)}
         </div>

         {/* Bars */}
         {data.map((item, index) => {
            const heightPercent = Math.max((item.revenue / maxRevenue) * 100, 4);
            
            return (
               <div 
                  key={index} 
                  className="relative flex-1 flex flex-col justify-end items-center h-full group z-10"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
               >
                  {/* Tooltip */}
                  <div className={`absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded p-2 shadow-lg transition-opacity z-20 whitespace-nowrap ${hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                     <p className="font-bold">{item.date}</p>
                     <p>Doanh thu: {formatCurrency(item.revenue)}</p>
                     <p>Đơn hàng: {item.orders}</p>
                  </div>

                  {/* Bar */}
                  <div 
                     className={`w-full max-w-[30px] sm:max-w-[50px] rounded-t transition-all duration-500 ${hoveredIndex === index ? 'bg-blue-600 scale-y-105' : 'bg-blue-500 dark:bg-blue-600'}`}
                     style={{ height: `${heightPercent}%` }}
                  ></div>

                  {/* Label */}
                  <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">{item.date}</span>
               </div>
            )
         })}
      </div>
    </div>
  );
}