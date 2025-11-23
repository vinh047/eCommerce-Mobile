"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
} from "../signin/style";
import InputForm from "../signin/InputForm";
import "../signin/style.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const err = {};
    if (!email) err.email = "Email không được để trống";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) err.email = "Email không đúng định dạng";
    if (!password) err.password = "Mật khẩu không được để trống";
    if (password !== confirm) err.confirm = "Mật khẩu xác nhận không khớp";
    return err;
  };

  const handleSignup = async () => {
    setApiError("");
    setSuccess("");
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      // derive name from email local part to keep UI unchanged
      const name = email.split("@")[0] || email;
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      if (res.ok || res.status === 201) {
        setSuccess("Đăng ký thành công. Chuyển tới đăng nhập...");
        setTimeout(() => router.push("/signin"), 900);
      } else {
        setApiError(data.error || JSON.stringify(data) || "Đăng ký thất bại");
      }
    } catch (e) {
      console.error("Signup fetch error:", e);
      setApiError("Lỗi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          display: "flex",
          background: "#fff",
          borderRadius: "16px",
        }}
      >
        <WrapperContainerLeft>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Xin chào</h1>
          <p>Đăng ký tài khoản của bạn</p>

          <InputForm
            style={{ margin: "16px 0px 16px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}

          <InputForm
            style={{ marginBottom: "16px" }}
            placeholder="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}

          <InputForm
            placeholder="Xác nhận mật khẩu"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {errors.confirm && <div style={{ color: "red" }}>{errors.confirm}</div>}

          <button
            id="SignupButton"
            type="button"
            className="signup-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
          {apiError && <div style={{ color: "red", marginTop: 8 }}>{apiError}</div>}

          <p>
            Đã có tài khoản?{" "}
            <Link href="/signin" passHref>
              <WrapperText>Đăng nhập</WrapperText>
            </Link>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <div className="signup-image-container">
            <img
              src="/assets/b4d225f471fe06887284e1341751b36e.png"
              alt="sign-in"
              className="signup-image"
            />
          </div>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default Signup;