"use client";

import { useState } from "react";
import {
  Menu,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const userAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%234F46E5'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EA%3C/text%3E%3C/svg%3E";

export default function Header({ isDark, toggleTheme, toggleSidebar }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <button
              id="sidebarToggle"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-blue-600">
                Admin
              </a>
              <ChevronRight className="text-xs text-gray-400" />
              <span className="text-gray-900 dark:text-white">Dashboard</span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm email, mã đơn, SKU, IMEI..."
                className="w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Create Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus />
              <span className="hidden md:inline">Tạo mới</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Bell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              id="themeToggle"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={toggleTheme}
            >
              {isDark ? <Sun /> : <Moon />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                id="userMenuToggle"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img
                  src={userAvatar}
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@mobilestore.com
                  </p>
                </div>
                <ChevronDown className="text-xs text-gray-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <a
                    href="#"
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                  >
                    <User className="w-4 mr-2" />
                    Hồ sơ
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Settings className="w-4 mr-2" />
                    Cài đặt
                  </a>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <a
                    href="#"
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <LogOut className="w-4 mr-2" />
                    Đăng xuất
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
