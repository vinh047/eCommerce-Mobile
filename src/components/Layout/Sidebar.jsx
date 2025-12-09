"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // lấy user + hasPermission
import {
  Home,
  ShoppingCart,
  Box,
  Palette,
  Tag,
  BadgePercent,
  Users,
  Star,
  Warehouse,
  Repeat,
  CreditCard,
  UserCog,
  ShieldCheck,
  BarChart3,
  Building2,
  ListChecks,
  Smartphone,
} from "lucide-react";
import { PERMISSION_KEYS } from "@/app/admin/constants/permissions"; 

const navItems = [
  { name: "Dashboard", icon: Home, href: "/admin/dashboard" }, // không cần quyền

  {
    name: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    badgeColor: "bg-red-100 text-red-600",
    permission: PERMISSION_KEYS.VIEW_ORDER,
  },
  { name: "Sản phẩm", icon: Box, href: "/admin/products", permission: PERMISSION_KEYS.VIEW_PRODUCT },
  { name: "Variants", icon: Palette, href: "/admin/variants", permission: PERMISSION_KEYS.VIEW_VARIANT },
  { name: "Danh mục", icon: Tag, href: "/admin/category", permission: PERMISSION_KEYS.VIEW_CATEGORY },
  { name: "Thương hiệu", icon: Building2, href: "/admin/brands", permission: PERMISSION_KEYS.VIEW_BRAND },
  { name: "Thông số kỹ thuật", icon: ListChecks, href: "/admin/specs", permission: PERMISSION_KEYS.VIEW_SPEC },
  { name: "Mã giảm giá", icon: BadgePercent, href: "/admin/coupons", permission: PERMISSION_KEYS.VIEW_COUPON },
  { name: "Người dùng", icon: Users, href: "/admin/users", permission: PERMISSION_KEYS.VIEW_CUSTOMER },
  { name: "Đánh giá", icon: Star, href: "/admin/reviews", permission: PERMISSION_KEYS.VIEW_REVIEW },
  { name: "Kho & Thiết bị", icon: Warehouse, href: "/admin/inventory", permission: PERMISSION_KEYS.VIEW_INVENTORY },
  {
    name: "RMA (Đổi/Trả)",
    icon: Repeat,
    href: "/admin/rmas",
    badgeColor: "bg-orange-100 text-orange-600",
    permission: PERMISSION_KEYS.VIEW_RMA,
  },
  {
    name: "Phương thức thanh toán",
    icon: CreditCard,
    href: "/admin/payment_methods",
    permission: PERMISSION_KEYS.VIEW_PAYMENT_METHOD,
  },
  { name: "Nhân sự", icon: UserCog, href: "/admin/staff", permission: PERMISSION_KEYS.VIEW_STAFF },
  { name: "Phân Quyền", icon: ShieldCheck, href: "/admin/roles", permission: PERMISSION_KEYS.VIEW_ROLE },
  { name: "Thống kê", icon: BarChart3, href: "/admin/reports", permission: PERMISSION_KEYS.VIEW_REPORT },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return (
    <>
      <div
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-30 sidebar-transition transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Smartphone className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                MobileStore
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="overflow-y-auto h-[calc(100vh-80px)] p-4 space-y-2 pb-10 subtle-scroll">
          {navItems
            .filter((item) => !item.permission || hasPermission(item.permission)) // lọc theo quyền
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                  `}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto text-xs px-2 py-1 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && typeof window !== "undefined" && window.innerWidth < 1024 && (
        <div
          id="sidebarOverlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
