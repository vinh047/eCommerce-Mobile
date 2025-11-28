// app/(admin)/AdminLayout.jsx — SERVER COMPONENT

import AdminLayoutClient from "@/components/Layout/AdminLayout";


export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </div>
  );
}
