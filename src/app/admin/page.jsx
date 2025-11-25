// src/app/page.jsx
"use client";

import Alerts from "@/app/admin/dashboard/_components/Alerts";
import KPICards from "@/app/admin/dashboard/_components/KPICards";
import RecentOrders from "@/app/admin/dashboard/_components/RecentOrders";
import RecentReviews from "@/app/admin/dashboard/_components/RecentReviews";
import SalesCharts from "@/app/admin/dashboard/_components/SalesCharts";
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
