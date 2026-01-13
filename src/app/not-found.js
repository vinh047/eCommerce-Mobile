"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import tRexAnimation from "public/assets/404-page-not-found.json";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      {/* Animation từ file JSON của bạn */}
      <div className="w-full max-w-[500px]">
        <Lottie animationData={tRexAnimation} loop={true} autoplay={true} />
      </div>

      {/* Nội dung thông báo */}
      <div className="text-center mt-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          404 - Trang không tìm thấy
        </h1>

        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Chú khủng long T-Rex đã đi lạc và trang bạn tìm kiếm cũng vậy.
        </p>

        {/* Nút quay về trang chủ */}
        <div className="mt-8">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
