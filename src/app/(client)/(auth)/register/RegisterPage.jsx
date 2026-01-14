"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock, User, UserPlus, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/form/Button";
import { Input } from "@/components/ui/form/Input";
import { ROUTES } from "@/config/routes";

const RegisterPage = () => {
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
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      toast.success(res.data.message || "Đăng ký thành công!");
      router.push(ROUTES.LOGIN);
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
      router.push(ROUTES.HOME);
      router.refresh();
    } catch (error) {
      const msg = error.response?.data?.error || "Đăng ký Google thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <Button
          as={Link}
          href={ROUTES.HOME}
          ghost
          size="sm"
          className="text-gray-500 hover:text-blue-600 hover:bg-white/80 backdrop-blur-sm shadow-sm border border-transparent hover:border-gray-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản
            </h1>
            <p className="text-gray-500">
              Đăng ký để trở thành thành viên và hưởng nhiều ưu đãi.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Input Tên */}
            <Input
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              fullWidth
              size="md"
              leftIcon={<User className="h-5 w-5" />}
              error={errors.name}
            />

            {/* Input Email */}
            <Input
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              fullWidth
              size="md"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email}
            />

            {/* Input Mật khẩu */}
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              fullWidth
              size="md"
              leftIcon={<Lock className="h-5 w-5" />}
              error={errors.password}
              showPasswordToggle={true}
            />

            {/* Input Xác nhận mật khẩu */}
            <Input
              placeholder="Nhập lại mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: "" });
              }}
              fullWidth
              size="md"
              leftIcon={<Lock className="h-5 w-5" />}
              error={errors.confirmPassword}
              showPasswordToggle={true}
            />

            {/* Submit Button */}
            <Button
              primary
              size="lg"
              fullWidth
              type="submit"
              loading={loading}
              className="shadow-lg shadow-blue-200 mt-4"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Đăng ký
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Hoặc đăng ký với
              </span>
            </div>
          </div>

          {/* Google Button */}
          <div className="flex justify-center">
            <div className="w-full max-w-[280px]">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => toast.error("Google đăng ký thất bại")}
                width="100%"
                theme="outline"
                shape="pill"
                size="large"
                text="register_with"
              />
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        <div className="hidden md:block md:w-1/2 relative bg-blue-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 z-10" />
          <img
            src="/assets/b4d225f471fe06887284e1341751b36e.png"
            alt="Sign Up Illustration"
            className="w-full h-full object-cover"
          />

          {/* Text Overlay */}
          <div className="absolute bottom-12 left-12 right-12 z-20 backdrop-blur-md bg-white/30 p-6 rounded-2xl border border-white/50 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bắt đầu hành trình mua sắm
            </h3>
            <p className="text-sm text-gray-800">
              Tạo tài khoản ngay hôm nay để theo dõi đơn hàng, lưu sản phẩm yêu
              thích và nhận thông báo khuyến mãi sớm nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
