"use client";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function HeaderUser() {
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    TechMobile
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <Link href="/">Trang chủ</Link>
                    <Link href="/products">Sản phẩm</Link>
                    <Link href="/about">Giới thiệu</Link>
                    <Link href="/contact">Liên hệ</Link>
                </nav>

                {/* Cart */}
                <Link href="/cart" className="relative hidden md:block">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-gray-700 text-xl" />
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        2
                    </span>
                </Link>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-700 text-2xl focus:outline-none"
                >
                    <FontAwesomeIcon icon={open ? faTimes : faBars} />
                </button>
            </div>

            {/* Mobile Nav */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3 shadow-md">
                    <Link href="/" className="block">Trang chủ</Link>
                    <Link href="/products" className="block">Sản phẩm</Link>
                    <Link href="/about" className="block text-blue-600 font-semibold">Giới thiệu</Link>
                    <Link href="/contact" className="block">Liên hệ</Link>
                    <Link href="/cart" className="block">Giỏ hàng</Link>
                </div>
            )}
        </header>
    );
}
