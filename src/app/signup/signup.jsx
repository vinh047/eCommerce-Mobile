"use client";
import React from "react";
import Link from "next/link";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
} from "../signin/style";
import InputForm from "../signin/InputForm";
import "../signin/style.css";

const Signup = () => {
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
          <p>Đăng ký tài khoản của bạn</p>
          <InputForm
            style={{ margin: "16px 0px 16px" }}
            placeholder="abc@gmail.com"
          />
          <InputForm
            style={{ marginBottom: "16px" }}
            placeholder="Mật khẩu"
            type="password"
          />
          <InputForm placeholder="Xác nhận mật khẩu" type="password" />
          <button id="SignupButton" type="button" className="signup-btn">
            Đăng ký
          </button>
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
