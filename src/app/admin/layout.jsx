// app/(admin)/AdminLayout.jsx — SERVER COMPONENT

import AdminLayoutClient from "@/components/Layout/AdminLayout";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthProvider>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </AuthProvider>
    </div>
  );
}
