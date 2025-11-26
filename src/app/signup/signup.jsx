"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperText,
} from "../signin/style";
import InputForm from "../signin/InputForm";
import "../signin/style.css";

const Signup = () => {
  const router = useRouter();
  
  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate
  const validate = () => {
    let err = {};
    if (!name.trim()) err.name = "Tên không được để trống";
    
    if (!email) {
      err.email = "Email không được để trống";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      err.email = "Email không đúng định dạng";
    }

    if (!password) {
      err.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      err.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (confirmPassword !== password) {
      err.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return err;
  };

  // Register Email/Pass
  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", { name, email, password });
      toast.success(res.data.message || "Đăng ký thành công!");
      router.push("/signin")
    } catch (error) {
      const msg = error.response?.data?.error || "Đăng ký thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Register Google
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", {
        token: credentialResponse.credential,
      });
      toast.success(res.data.message || "Đăng ký Google thành công!");
      router.push("/");
      router.refresh();
    } catch (error) {
      const msg = error.response?.data?.error || "Đăng ký Google thất bại";
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
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "520px", // Tăng chiều cao chút để chứa đủ input
          display: "flex",
          background: "#fff",
          borderRadius: "16px",
          // Thêm box-shadow nhẹ nếu muốn giống signin (tùy chọn)
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <WrapperContainerLeft className="px-10 py-4">
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Xin chào</h1>
          <p>Đăng ký tài khoản của bạn</p>
          
          {/* Bọc form để xử lý submit */}
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            
            {/* Input Tên */}
            <InputForm
              style={{ margin: "16px 0px 8px" }}
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>{errors.name}</div>}

            {/* Input Email */}
            <InputForm
              style={{ marginBottom: "8px" }}
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>{errors.email}</div>}

            {/* Input Mật khẩu */}
            <InputForm
              style={{ marginBottom: "8px" }}
              placeholder="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>{errors.password}</div>}

            {/* Input Xác nhận Mật khẩu */}
            <InputForm 
              style={{ marginBottom: "8px" }}
              placeholder="Xác nhận mật khẩu" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <div style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>{errors.confirmPassword}</div>}

            {/* Nút Đăng ký */}
            <button 
              id="SignupButton" 
              type="submit" 
              className="signup-btn"
              disabled={loading}
              style={{ 
                marginTop: "8px",
                marginBottom: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            {/* Nút Google */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <GoogleLogin
                  onSuccess={handleGoogleRegister}
                  onError={() => toast.error("Google sign up thất bại")}
                  text="signup_with"
                  width="320"
                />
            </div>

            <p >
              Đã có tài khoản?{" "}
              <Link href="/signin" passHref style={{ textDecoration: 'none' }}>
                <WrapperText>Đăng nhập</WrapperText>
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
              // Căn chỉnh ảnh cho đẹp
              style={{ objectFit: "cover", height: "100%", width: "100%", borderRadius: "0 16px 16px 0" }}
            />
          </div>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default Signup;