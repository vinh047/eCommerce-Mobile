"use client";

import { useFetchReports } from "../hooks/useFetchReports";
import ReportsHeader from "./ReportsHeader";
import ReportsSummary from "./ReportsSummary";
import ReportsToolbar from "./ReportsToolbar";
import RevenueChart from "./RevenueChart";
import TopProducts from "./TopProducts";


export default function ReportsClient() {
  const { data, isLoading, range, setRange } = useFetchReports();

  if (isLoading && !data) {
    return (
       <div className="p-8 space-y-6 animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-4 gap-6">
             {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
       </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <ReportsHeader />
      
      <ReportsToolbar range={range} setRange={setRange} />

      <ReportsSummary summary={data?.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart chiếm 2/3 */}
         <div className="lg:col-span-2">
            <RevenueChart data={data?.chartData} />
         </div>
         
         {/* Top Products chiếm 1/3 */}
         <div>
            <TopProducts products={data?.topProducts} />
         </div>
      </div>
    </div>
  );
}