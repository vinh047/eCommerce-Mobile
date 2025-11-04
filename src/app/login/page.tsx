"use client";

import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            setMessage("Đăng nhập thành công! Token: " + res.data.token);
        } catch (err: any) {
            setMessage("Lỗi đăng nhập: " + err.response?.data?.error);
        }
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            const credential = credentialResponse.credential;
            const res = await axios.post("/api/auth/google", { token: credential });
            setMessage("Google login thành công! Token: " + res.data.token);
        } catch (err) {
            console.error(err);
        }

    };

    const decodeJwt = (token: string) =>
        JSON.parse(atob(token.split(".")[1]));

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>

            <div className="space-y-3">
                <input
                    type="email"
                    placeholder="Email"
                    className="border px-3 py-2 rounded w-64"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="border px-3 py-2 rounded w-64"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-64"
                >
                    Đăng nhập
                </button>
            </div>

            <div className="text-gray-500">hoặc</div>

            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setMessage("Google login thất bại")}
            />

            <p>{message}</p>
        </div>
    );
}
