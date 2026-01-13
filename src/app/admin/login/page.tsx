"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/admin/auth/login", {
        email,
        password,
      });

      setMessage("Đăng nhập thành công!");
      
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 600);

    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Đăng nhập thất bại.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-8 border border-gray-200">
          
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Admin Login
          </h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {message && (
            <div className="mt-4 text-center text-sm text-red-600">
              {message}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Dành cho nhân viên và quản trị hệ thống.
        </p>
      </div>
    </div>
  );
}
