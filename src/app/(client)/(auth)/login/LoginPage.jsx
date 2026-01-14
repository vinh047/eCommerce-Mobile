"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Lock, Check, LogIn, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/form/Button";
import { Input } from "@/components/ui/form/Input";
import { ROUTES } from "@/config/routes";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
      const res = await axios.post("/api/auth/login", { token: credential });

      toast.success(res.data.message || "Đăng nhập Google thành công!");
      router.push(ROUTES.HOME);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });

      toast.success(res.data.message || "Đăng nhập thành công!");
      router.push(ROUTES.HOME);
      router.refresh();
    } catch (err) {
      const msg = err.response?.data?.error || "Đăng nhập thất bại";
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào,</h1>
            <p className="text-gray-500">
              Nhập thông tin để đăng nhập vào tài khoản của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              placeholder="Email của bạn"
              type="email"
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

            {/* Password Input */}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    rememberMe
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300 group-hover:border-blue-500"
                  }`}
                >
                  {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>

              <Link
                href="/ForgotPassword"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              primary
              size="lg"
              fullWidth
              type="submit"
              loading={loading}
              className="shadow-lg shadow-blue-200 mt-2"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <div className="w-full max-w-[280px]">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login thất bại")}
                width="100%"
                theme="outline"
                shape="pill"
                size="large"
              />
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Tạo tài khoản mới
            </Link>
          </p>
        </div>

        <div className="hidden md:block md:w-1/2 relative bg-blue-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 z-10" />
          <img
            src="/assets/b4d225f471fe06887284e1341751b36e.png"
            alt="Sign In Illustration"
            className="w-full h-full object-cover"
          />

          {/* Text Overlay */}
          <div className="absolute bottom-12 left-12 right-12 z-20 backdrop-blur-md bg-white/30 p-6 rounded-2xl border border-white/50 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Trải nghiệm mua sắm tuyệt vời
            </h3>
            <p className="text-sm text-gray-800">
              Hàng ngàn sản phẩm chất lượng đang chờ đón bạn. Đăng nhập ngay để
              khám phá ưu đãi!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
