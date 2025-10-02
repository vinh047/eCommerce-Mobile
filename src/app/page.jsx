// src/app/page.jsx
"use client";

import Alerts from "@/components/Dashboard/Alerts";
import KPICards from "@/components/Dashboard/KPICards";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import RecentReviews from "@/components/Dashboard/RecentReviews";
import SalesCharts from "@/components/Dashboard/SalesCharts";
import AdminLayout from "@/components/Layout/AdminLayout";

export default function Home() {
  return (
    <AdminLayout>
      <KPICards />
      <SalesCharts />

      {/* Recent Orders & Reviews/Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RecentOrders />

        <div className="space-y-6">
          <RecentReviews />
          <Alerts />
        </div>
      </div>
    </AdminLayout>
  );
}
