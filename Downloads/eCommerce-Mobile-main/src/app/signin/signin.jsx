"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
} from "./style";
import InputForm from "./InputForm";
import "./style.css";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State cho Remember Me
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate form
  const validate = () => {
    let err = {};
    if (!email) {
      err.email = "Email không được để trống";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      err.email = "Email không đúng định dạng";
    }

    if (!password) {
      err.password = "Mật khẩu không được để trống";
    }
    return err;
  };

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      const credential = credentialResponse.credential;
      // Mặc định Google Login sẽ tự giữ trạng thái,
      // hoặc bạn có thể gửi thêm { token: credential, rememberMe: true } nếu muốn
      const res = await axios.post("/api/auth/login", { token: credential });

      toast.success(res.data.message || "Đăng nhập Google thành công!");

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Submit Form (Email/Password)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      // Gửi thêm rememberMe lên server
      const res = await axios.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });

      toast.success(res.data.message || "Đăng nhập thành công!");

      router.push("/");
      router.refresh();
    } catch (err) {
      const msg = err.response?.data?.error || "Đăng nhập thất bại";
      toast.error(msg);
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
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "480px", // Tăng chiều cao một chút để chứa checkbox
          display: "flex",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <WrapperContainerLeft className="px-10 py-4">
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Xin chào</h1>
          <p>Đăng nhập vào tài khoản của bạn</p>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <InputForm
              style={{ margin: "16px 0px 8px" }}
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div
                style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}
              >
                {errors.email}
              </div>
            )}

            <InputForm
              placeholder="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {errors.password}
              </div>
            )}

            {/* --- CHECKBOX GHI NHỚ ĐĂNG NHẬP --- */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                // accent-sky-400: Tạo màu xanh dương nhạt khi tick
                className="w-4 h-4 cursor-pointer mr-2 rounded accent-sky-400 focus:ring-sky-400 ms-1"
              />
              <label
                htmlFor="rememberMe"
                style={{ fontSize: "14px", cursor: "pointer", color: "#555" }}
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            {/* ---------------------------------- */}

            <button
              id="SignupButton"
              type="submit"
              className="signup-btn"
              disabled={loading}
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login thất bại")}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
              }}
            >
              <Link
                href="/ForgotPassword"
                passHref
                style={{ textDecoration: "none" }}
              >
                <WrapperText>Quên mật khẩu?</WrapperText>
              </Link>

              <p style={{ margin: 0 }}>
                Chưa có tài khoản?{" "}
                <Link
                  href="/signup"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <WrapperText>Tạo tài khoản</WrapperText>
                </Link>
              </p>
            </div>
          </form>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <div className="signup-image-container">
            <img
              src="/assets/b4d225f471fe06887284e1341751b36e.png"
              alt="sign-in"
              className="signup-image"
              style={{
                objectFit: "cover",
                height: "100%",
                width: "100%",
                borderRadius: "0 16px 16px 0",
              }}
            />
          </div>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default Signin;
