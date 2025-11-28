"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import { useFetchDashboard } from "./dashboard/hooks/useFetchDashboard";
import KPICards from "./dashboard/_components/KPICards";
import SalesCharts from "./dashboard/_components/SalesCharts";
import RecentOrders from "./dashboard/_components/RecentOrders";
import Alerts from "./dashboard/_components/Alerts";
import RecentReviews from "./dashboard/_components/RecentReviews";

export default function Home() {
  const { data, isLoading } = useFetchDashboard();

  if (isLoading) {
    return (
      <div className="px-8 py-6 space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>

        {/* Recent orders + alerts/reviews skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Orders list chiếm 2 cột */}
          <div className="h-96 xl:col-span-2 space-y-4 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>

          {/* Alerts + Reviews chiếm 1 cột */}
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tổng quan
        </h1>
        <p className="text-gray-500 text-sm">
          Chào mừng trở lại, đây là số liệu hôm nay.
        </p>
      </div>

      <KPICards data={data?.kpi} />
      <SalesCharts data={data?.salesData} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RecentOrders orders={data?.recentOrders} />
        <div className="space-y-6">
          <Alerts alerts={data?.alerts} />
          <RecentReviews reviews={data?.recentReviews} />
        </div>
      </div>
    </div>
  );
}
