"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  ChevronRight,
  ChevronDown,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";

const userAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%234F46E5'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EA%3C/text%3E%3C/svg%3E";

export default function Header({ isDark, toggleTheme, toggleSidebar }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // SỬA LỖI 1: Bỏ <HTMLDivElement> vì đây là file JSX
  const menuRef = useRef(null);

  const pathname = usePathname();

  // Logic: Click ra ngoài thì đóng menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Sidebar Toggle & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center text-sm font-medium">
              <span className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors">
                Admin
              </span>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
                {pathname
                  ? pathname.replace("/admin/", "").toUpperCase()
                  : "DASHBOARD"}
              </span>
            </nav>
          </div>

          {/* CENTER: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full text-gray-500 focus-within:text-indigo-600 dark:focus-within:text-indigo-400">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Tìm kiếm nhanh (Ctrl + K)..."
              />
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button Mobile Only */}
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notification */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

            {/* User Menu Dropdown */}
            {/* SỬA LỖI 2: Thêm ref={menuRef} vào đây để bắt sự kiện click outside */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-3 p-1.5 rounded-full sm:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                  isUserMenuOpen
                    ? "bg-gray-100 dark:bg-gray-800 ring-2 ring-indigo-500/20"
                    : ""
                }`}
              >
                <img
                  src={userAvatar}
                  alt="User"
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                />
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    admin@mobilestore.com
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  } hidden sm:block`}
                />
              </button>

              {/* Dropdown Content */}
              <div
                className={`
                  absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 z-50
                  transition-all duration-200 ease-out transform
                  ${
                    isUserMenuOpen
                      ? "opacity-100 scale-100 visible"
                      : "opacity-0 scale-95 invisible"
                  }
                `}
              >
                <div className="py-2 px-2">
                  <div className="px-3 py-2 sm:hidden border-b border-gray-100 dark:border-gray-700 mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      admin@mobilestore.com
                    </p>
                  </div>

                  <a
                    href="#"
                    className="group flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                    Hồ sơ cá nhân
                  </a>
                  <a
                    href="#"
                    className="group flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                  >
                    <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                    Cài đặt hệ thống
                  </a>
                </div>

                <div className="py-2 px-2">
                  <button className="w-full group flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
