import React from "react";
import { ProfileSidebar } from "./_components/ProfileSidebar";
import HeaderLayout from "@/components/Layout/HeaderLayout";

export default function ProfileLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4 lg:px-0">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex">
          <div className="shrink-0">
            <ProfileSidebar />
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
