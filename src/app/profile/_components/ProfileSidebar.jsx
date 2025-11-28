"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileSidebar() {
  const pathname = usePathname();

  const itemClass = (href) =>
    [
      "block px-4 py-2 rounded-md text-sm",
      pathname === href
        ? "bg-gray-100 font-semibold text-gray-900"
        : "text-gray-700 hover:bg-gray-50",
    ].join(" ");

  return (
    <aside className="w-64 border-r border-gray-100 bg-white">
      <nav className="px-2 py-2 space-y-1 text-sm">
        <Link href="/profile" className={itemClass("/profile")}>
          Thông tin tài khoản
        </Link>

        <Link href="/profile/orders" className={itemClass("/profile/orders")}>
          Đơn hàng của tôi
        </Link>

        {/* 🆕 Thêm mục quản lý địa chỉ */}
        <Link href="/profile/addresses" className={itemClass("/profile/addresses")}>
          Sổ địa chỉ
        </Link>
      </nav>
    </aside>
  );
}
