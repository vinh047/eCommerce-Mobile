"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi mail ở đây (gọi API)
    setSent(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // background: "rgba(0, 0, 0, 0.53)",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          borderRadius: "16px",
          padding: "32px 24px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>
          Quên mật khẩu
        </h1>
        <p style={{ marginBottom: 20 }}>
          Nhập email đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>
        {sent ? (
          <div style={{ color: "#2563eb", fontWeight: 500, marginBottom: 20 }}>
            Đã gửi liên kết đặt lại mật khẩu tới email của bạn!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="forgot-input"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                marginBottom: "18px",
                fontSize: "1rem",
              }}
            />
            <button type="submit" className="signup-btn">
              Gửi liên kết
            </button>
          </form>
        )}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href={ROUTES.LOGIN} passHref>
            <span style={{ color: "#2563eb", cursor: "pointer" }}>
              Quay lại đăng nhập
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
