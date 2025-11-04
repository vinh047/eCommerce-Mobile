"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) setMessage("✅ Đăng ký thành công!");
            else setMessage("❌ " + (data.error || "Đăng ký thất bại"));
        } catch (err) {
            setMessage("❌ Lỗi server!");
        }
    };

    const handleGoogleRegister = async (credentialResponse: any) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }), // 👈 Gửi token Google
            });
            const data = await res.json();
            if (res.ok) setMessage("✅ Đăng ký/Đăng nhập Google thành công!");
            else setMessage("❌ " + (data.error || "Google đăng ký thất bại"));
        } catch (err) {
            console.error(err);
            setMessage("❌ Lỗi server!");
        }
    };

    return (
        <div className="flex flex-col items-center mt-10 space-y-4">
            <h2 className="text-2xl font-semibold">Đăng ký tài khoản</h2>

            <form onSubmit={handleRegister} className="flex flex-col space-y-3 w-64">
                <input
                    name="name"
                    placeholder="Tên"
                    value={form.name}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white rounded py-1 hover:bg-green-600"
                >
                    Đăng ký
                </button>
            </form>

            <div className="text-gray-500">Hoặc</div>

            {/* Nút Google */}
            <GoogleLogin onSuccess={handleGoogleRegister} onError={() => console.log("Google failed")} />

            {message && <div className="mt-3 text-sm text-center">{message}</div>}
        </div>
    );
}
