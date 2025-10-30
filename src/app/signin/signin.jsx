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

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

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
    const fakeAccounts = [
      { email: "test@gmail.com", password: "123456" },
      { email: "demo@gmail.com", password: "654321" },
      { email: "user@example.com", password: "password" },
    ];
    e.preventDefault();
    setApiError(""); // Xóa lỗi cũ
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // Giả lập gọi API đăng nhập
      // Thay đoạn này bằng gọi API thực tế của bạn
      const matched = fakeAccounts.find(
        (acc) => acc.email === email && acc.password === password
      );
      if (!matched) {
        setApiError("Sai email hoặc mật khẩu. Vui lòng thử lại.");
      } else {
        setApiError("");
        alert("Đăng nhập thành công!");
      }
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
