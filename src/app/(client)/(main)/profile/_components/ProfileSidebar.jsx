"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ShoppingBag, MapPin, LogOut } from "lucide-react";
import usersApi from "@/lib/api/usersApi";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";

// Cấu hình menu items
const MENU_ITEMS = [
  {
    label: "Thông tin tài khoản",
    href: ROUTES.PROFILE.INDEX,
    icon: User,
  },
  {
    label: "Đơn hàng của tôi",
    href: ROUTES.PROFILE.ORDERS,
    icon: ShoppingBag,
  },
  {
    label: "Sổ địa chỉ",
    href: ROUTES.PROFILE.ADDRESS,
    icon: MapPin,
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      if (usersApi && usersApi.logout) await usersApi.logout();
      else await fetch("/api/auth/logout", { method: "POST" });

      router.replace(ROUTES.LOGIN);
      router.refresh();
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full min-h-[600px] h-full">
      <div className="px-6 py-6 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Tài khoản</h2>
        <p className="text-xs text-gray-400 mt-1">Quản lý hồ sơ của bạn</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm" // Active Style
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" // Normal Style
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
