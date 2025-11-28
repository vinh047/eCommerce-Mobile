// src/components/Header.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import usersApi from "@/lib/api/usersApi";

/**
 * Header.jsx (styled)
 * - Improved visual design using Tailwind CSS
 * - Responsive layout, subtle shadows, smooth hover/transition effects
 * - Search with icon, prominent CTA buttons, polished profile dropdown
 */

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingUser(true);
        if (usersApi && usersApi.getCurrentUser) {
          const res = await usersApi.getCurrentUser();
          if (!mounted) return;
          if (res && res.data) setUser(res.data);
          else if (res && res.id) setUser(res);
          else setUser(null);
        } else {
          const r = await fetch("/api/auth/me", { credentials: "include" });
          if (r.ok) {
            const j = await r.json();
            if (mounted) setUser(j);
          } else {
            if (mounted) setUser(null);
          }
        }
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();

    (async () => {
      try {
        const r = await fetch("/api/cart/count", { credentials: "include" });
        if (r.ok) {
          const j = await r.json();
          if (j && typeof j.count === "number") {
            setCartCount(j.count);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
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
          }
        }
      } catch {}
    })();

    function onDoc(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => {
      mounted = false;
      document.removeEventListener("click", onDoc);
    };
  }, []);

  async function handleLogout() {
    try {
      if (usersApi && usersApi.logout) {
        await usersApi.logout();
      } else {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setProfileOpen(false);
      router.replace("/");
    }
  }

  async function onSearchSubmit(e) {
    if (e) e.preventDefault();
    const qRaw = (search || "").trim();
    if (!qRaw) return;

    try {
      const res = await fetch("/api/infer-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: qRaw }),
      });
      const data = await res.json();
      if (data?.ok && data.category) {
        // redirect tới category page với q param
        router.push(`/${data.category}?q=${encodeURIComponent(qRaw)}`);
      } else {
        // fallback: search chung
        router.push(`/search?q=${encodeURIComponent(qRaw)}`);
      }
    } catch (err) {
      console.error("infer category error", err);
      router.push(`/search?q=${encodeURIComponent(qRaw)}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-extrabold shadow-md transform-gpu hover:scale-105 transition">
                <span className="text-lg">VN</span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-semibold text-lg text-gray-900">
                  VN Shop
                </span>
                <span className="text-xs text-gray-500">Mua sắm tiện lợi</span>
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 px-4">
            <form onSubmit={onSearchSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full border border-gray-200 rounded-full pl-10 pr-36 py-2.5 bg-white text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                />

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full shadow hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <span className="hidden sm:inline-block text-sm font-medium">
                    Tìm
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Auth buttons */}
            {!loadingUser && !user && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => router.push(`/signin`)}
                  className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/signup?redirect=${encodeURIComponent(router.pathname)}`
                    )
                  }
                  className="px-3 py-1.5 rounded-md bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-sm shadow hover:opacity-95 transition"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Profile dropdown */}
            {!loadingUser && user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-800 font-semibold shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-sm font-medium text-gray-800 leading-tight">
                      {user.name || user.email}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 bg-gradient-to-r from-white to-gray-50">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.name || user.email}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <ul className="py-2">
                        <li>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Thông tin tài khoản
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/profile/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Đơn hàng của tôi
                          </Link>
                        </li>
                      </ul>
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <div className="relative">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h12l-2-7M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Giỏ hàng
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 shadow">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* small animation styles (Tailwind plugin not required) */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 160ms ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
