"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileSidebar({ name, email }) {
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
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        </div>
      </div>

      <nav className="px-2 py-2 space-y-1 text-sm">
        <Link href="/profile" className={itemClass("/profile")}>
          Thông tin tài khoản
        </Link>

        <Link href="/profile/orders" className={itemClass("/profile/orders")}>
          Đơn hàng của tôi
        </Link>

        <button className="mt-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md">
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
}
