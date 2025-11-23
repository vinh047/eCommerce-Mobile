"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
} from "./style";
import InputForm from "./InputForm";
import "./style.css";
import { GoogleLogin } from "@react-oauth/google"; // Thêm dòng này
import { useRouter } from "next/navigation";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Thêm hàm xử lý đăng nhập Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/");
        // Xử lý chuyển trang hoặc lưu token tại đây nếu cần
      } else {
        setApiError(data.error || "Đăng nhập Google thất bại");
      }
    } catch (err) {
      setApiError("Lỗi kết nối tới server");
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/");
      } else {
        setApiError(data.error || "Sai email hoặc mật khẩu. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Signin error:", err);
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
        // background: "rgba(0, 0, 0, 0.53)",
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
          <p>Đăng nhập vào tài khoản của bạn</p>
          <form onSubmit={handleSubmit}>
            <InputForm
              style={{ margin: "16px 0px 16px" }}
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
            <InputForm
              placeholder="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div style={{ color: "red" }}>{errors.password}</div>
            )}
            <button id="SignupButton" type="submit" className="signup-btn">
              Đăng nhập
            </button>
            {apiError && (
              <div style={{ color: "red", marginTop: 8 }}>{apiError}</div>
            )}
            {/* dr */}
            <div style={{ margin: "16px 0", textAlign: "center" }}>
              <span>Hoặc</span>
            </div>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError("Đăng nhập Google thất bại")}
              useOneTap={false}
              render={(renderProps) => (
                <button
                  type="button"
                  className="signup-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    color: "#2563eb",
                    border: "1px solid #2563eb",
                    marginBottom: "16px",
                    fontWeight: 700,
                    fontSize: "17px",
                    borderRadius: "16px",
                    padding: "16px 48px",
                    width: "100%",
                    cursor: "pointer",
                    gap: 12,
                  }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <img
                    src="/assets/google-g-icon.png"
                    alt="Google"
                    style={{ width: 20, height: 20 }}
                  />
                  Tiếp tục với Google
                </button>
              )}
            />
            {/* d */}
            <Link href="/ForgotPassword" passHref>
              <WrapperText>Quên mật khẩu</WrapperText>
            </Link>
            <p>
              Chưa có tài khoản?{" "}
              <Link href="/signup" passHref>
                <WrapperText>Tạo tài khoản</WrapperText>
              </Link>
            </p>
          </form>
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
export default Signin;