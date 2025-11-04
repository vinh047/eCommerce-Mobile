// src/app/page.jsx
"use client";

import Alerts from "src/components/Dashboard/Alerts";
import KPICards from "src/components/Dashboard/KPICards";
import RecentOrders from "src/components/Dashboard/RecentOrders";
import RecentReviews from "src/components/Dashboard/RecentReviews";
import SalesCharts from "src/components/Dashboard/SalesCharts";
import AdminLayout from "src/components/Layout/AdminLayout";

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
