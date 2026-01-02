// src/components/Header.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  LogOut,
  Package,
  UserCircle,
  Store,
  User as UserIcon,
  ShoppingCart,
} from "lucide-react";
import usersApi from "@/lib/api/usersApi";
import { globalEvents } from "@/lib/globalEvents";

import { Button } from "./ui/form/Button";
import { Input } from "./ui/form/Input";

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Mặc định true để hiện Skeleton ngay lập tức
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

  // ===== HÀM LOAD USER =====
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      if (usersApi && usersApi.getCurrentUser) {
        const res = await usersApi.getCurrentUser();
        if (res && res.data) setUser(res.data);
        else if (res && res.id) setUser(res);
        else setUser(null);
      } else {
        const r = await fetch("/api/auth/me", { credentials: "include" });
        if (r.ok) {
          const j = await r.json();
          setUser(j);
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // ===== HÀM LOAD CART COUNT =====
  const fetchCartCount = async () => {
    try {
      const r = await fetch("/api/cart/count", { credentials: "include" });
      if (r.ok) {
        const j = await r.json();
        if (j && typeof j.count === "number") {
          setCartCount(j.count);
          return;
        }
      }
    } catch (e) {}
    // Fallback logic
    try {
      const raw =
        typeof window !== "undefined"
          ? sessionStorage.getItem("checkoutItems")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items)) {
          const c = parsed.items.reduce(
            (s, it) => s + Number(it.quantity || 0),
            0
          );
          setCartCount(c);
          return;
        }
      }
    } catch {}
    setCartCount(0);
  };

  useEffect(() => {
    let mounted = true;
    fetchUser();
    fetchCartCount();

    function onDoc(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDoc);

    function onScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll);

    const offCart = globalEvents.onCartUpdated(() => {
      if (mounted) fetchCartCount();
    });
    const offUser = globalEvents.onUserUpdated(() => {
      if (mounted) fetchUser();
    });

    return () => {
      mounted = false;
      document.removeEventListener("click", onDoc);
      window.removeEventListener("scroll", onScroll);
      offCart && offCart();
      offUser && offUser();
    };
  }, []);

  async function handleLogout() {
    try {
      if (usersApi && usersApi.logout) await usersApi.logout();
      else
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setProfileOpen(false);
      router.replace("/");
      globalEvents.emitUserUpdated();
      globalEvents.emitCartUpdated();
    }
  }

  async function onSearchSubmit(e) {
    if (e) e.preventDefault();
    const qRaw = (search || "").trim();
    if (!qRaw) return;
    try {
      router.push(`/search?q=${encodeURIComponent(qRaw)}`);
    } catch (err) {
      router.push(`/search?q=${encodeURIComponent(qRaw)}`);
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          {/* 1. LOGO */}
          <div className="flex-shrink-0 min-w-[140px]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-200">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-xl text-blue-900 leading-none tracking-tight group-hover:text-blue-600 transition-colors">
                  VNShop
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                  STORE
                </span>
              </div>
            </Link>
          </div>

          {/* 2. SEARCH BAR */}
          <div className="flex-1 max-w-3xl px-4 lg:px-12">
            <form onSubmit={onSearchSubmit} className="relative w-full group">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Bạn muốn tìm gì hôm nay?"
                  className="w-full h-12 pl-12 pr-[90px] bg-gray-50 border border-gray-200 
                             focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 
                             rounded-full transition-all duration-200 outline-none text-gray-700 placeholder:text-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <div className="absolute right-1 top-1 bottom-1">
                  <button
                    type="submit"
                    className="h-full px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-full shadow-sm transition-colors cursor-pointer"
                  >
                    Tìm
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 3. ACTIONS (Cart & User) */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* --- CART ICON --- */}
            <Link
              href="/cart"
              className="relative group p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* --- USER PROFILE SECTION --- */}

            {loadingUser ? (
              <div className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-full border border-gray-100 bg-gray-50/50">
                <div className="hidden sm:block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse border-2 border-white" />
              </div>
            ) : (
              <>
                {/* TRẠNG THÁI CHƯA ĐĂNG NHẬP */}
                {!user && (
                  <div className="flex items-center gap-3 animate-in fade-in duration-300">
                    <Link
                      href="/signin"
                      className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <Link
                      href="/signup"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}

                {/* TRẠNG THÁI ĐÃ ĐĂNG NHẬP */}
                {user && (
                  <div
                    className="relative animate-in fade-in duration-300"
                    ref={profileRef}
                  >
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`
                        flex items-center gap-3 pl-4 pr-1 py-1 rounded-full border transition-all duration-200 bg-white cursor-pointer
                        ${
                          profileOpen
                            ? "border-blue-500 ring-2 ring-blue-100 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }
                      `}
                    >
                      {/* Tên hiển thị bên trái */}
                      <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate hidden sm:block">
                        {user.name || "Khách hàng"}
                      </span>

                      {/* Avatar hiển thị bên phải */}
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                        <div className="p-4 bg-gray-50/80 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="p-2 space-y-1">
                          <Link
                            href="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            <UserCircle className="w-4 h-4" />
                            Hồ sơ cá nhân
                          </Link>
                          <Link
                            href="/profile/orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            Đơn mua
                          </Link>
                        </div>

                        <div className="p-2 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
