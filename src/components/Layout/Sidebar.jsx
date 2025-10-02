"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faShoppingCart,
  faBox,
  faPalette,
  faImages,
  faTags,
  faAppleAlt,
  faTicketAlt,
  faUsers,
  faStar,
  faWarehouse,
  faExchangeAlt,
  faCreditCard,
  faUserShield,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { name: "Dashboard", icon: faChartPie, href: "/admin/dashboard" },
  {
    name: "Đơn hàng",
    icon: faShoppingCart,
    href: "/admin/orders",
    badge: 12,
    badgeColor: "bg-red-100 text-red-600",
  },
  { name: "Sản phẩm", icon: faBox, href: "/admin/products" },
  { name: "Variants", icon: faPalette, href: "/admin/variants" },
  { name: "Ảnh/Media", icon: faImages, href: "/admin/media" },
  { name: "Danh mục", icon: faTags, href: "/admin/categories" },
  { name: "Thương hiệu", icon: faAppleAlt, href: "/admin/brands" },
  { name: "Mã giảm giá", icon: faTicketAlt, href: "/admin/coupons" },
  { name: "Người dùng", icon: faUsers, href: "/admin/users" },
  { name: "Đánh giá", icon: faStar, href: "/admin/reviews" },
  { name: "Kho & Thiết bị", icon: faWarehouse, href: "/admin/inventory" },
  {
    name: "RMA (Đổi/Trả)",
    icon: faExchangeAlt,
    href: "/admin/rma",
    badge: 3,
    badgeColor: "bg-orange-100 text-orange-600",
  },
  { name: "Giao dịch thanh toán", icon: faCreditCard, href: "/admin/transactions" },
  { name: "Nhân sự & Phân quyền", icon: faUserShield, href: "/admin/staff" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

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
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-30 sidebar-transition transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}  `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faMobileAlt}
                className="text-white text-lg"
              />
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

        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  nav-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5" />
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

      {/* Mobile Sidebar Overlay */}
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
