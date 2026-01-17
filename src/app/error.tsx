"use client";

import WakeUpDB from "@/components/Home/wakeUpDb";
import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react"; // Đảm bảo bạn đã cài lucide-react
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isDBError, setIsDBError] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Trạng thái đang chuẩn đoán bệnh
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 10;

  useEffect(() => {
    // --- BƯỚC 1: LOG LỖI (Cho Developer xem ngầm) ---
    // Chỉ log ra console browser để dev debug, user bình thường sẽ không bật F12
    console.group("🚨 Application Error Diagnostics");
    console.error("Error Message:", error.message);
    console.error("Error Digest:", error.digest);
    console.error("Stack:", error.stack);
    console.groupEnd();

    // --- BƯỚC 2: CHUẨN ĐOÁN BỆNH (Logic Frontend) ---
    const lowerMsg = error.message?.toLowerCase() || "";

    // Danh sách từ khóa nhận diện lỗi kết nối Database / Server Cold Start
    const dbKeywords = [
      "database",
      "connection",
      "connect",
      "timeout",
      "prisma",
      "econnrefused",
      "500", // Đôi khi server lỗi 500 do mất kết nối DB
    ];

    const isConnectionIssue = dbKeywords.some((keyword) =>
      lowerMsg.includes(keyword),
    );

    setIsDBError(isConnectionIssue);

    // Nếu KHÔNG PHẢI lỗi DB, kết thúc kiểm tra ngay để hiện UI lỗi thường
    if (!isConnectionIssue) {
      setIsChecking(false);
      return;
    }

    // --- BƯỚC 3: XỬ LÝ NẾU LÀ LỖI DB (Polling) ---
    let isMounted = true;
    const wakeUpDatabase = async () => {
      for (let i = 0; i < MAX_RETRIES; i++) {
        if (!isMounted) return;

        try {
          setRetryCount(i + 1);
          // Gọi API cron hoặc health-check nhẹ
          const res = await fetch("/api/cron", { cache: "no-store" });

          if (res.ok) {
            window.location.reload(); // DB sống lại -> Reload trang
            return;
          }
        } catch (e) {
          /* Silent fail: Chờ lần thử tiếp theo */
        }
        // Đợi 3s trước khi thử lại
        await new Promise((r) => setTimeout(r, 3000));
      }

      // Hết số lần thử mà vẫn lỗi -> Chuyển sang hiển thị lỗi thường
      if (isMounted) {
        setIsChecking(false);
        setIsDBError(false); // Coi như không cứu được, hiện lỗi 500
      }
    };

    wakeUpDatabase();

    return () => {
      isMounted = false;
    };
  }, [error]);

  // --- RENDER GIAO DIỆN ---

  // 1. TRƯỜNG HỢP: Đang là lỗi DB (Cold Start) -> Hiển thị Component chờ
  if (isDBError) {
    return (
      <WakeUpDB
        isDBError={true}
        retryCount={retryCount}
        maxRetry={MAX_RETRIES}
      />
    );
  }

  // 2. TRƯỜNG HỢP: Đang kiểm tra (tránh flash nội dung)
  if (isChecking) {
    return null; // Hoặc return <LoadingSpinner />
  }

  // 3. TRƯỜNG HỢP: Lỗi ứng dụng thông thường (Code bug, Logic error...)
  // Giao diện thân thiện, che giấu lỗi kỹ thuật
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        {/* Icon minh họa */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đã có lỗi xảy ra
        </h2>

        {/* Nội dung thân thiện */}
        <p className="text-gray-500 mb-8">
          Hệ thống đang gặp sự cố tạm thời. Bạn có thể thử tải lại trang hoặc
          quay về trang chủ để tiếp tục sử dụng.
        </p>

        {/* Hành động */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-200"
          >
            <RefreshCw className="w-4 h-4" />
            Thử tải lại trang
          </button>

          <Link
            href={ROUTES.HOME}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
