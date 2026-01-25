"use client";

import WakeUpDB from "@/components/Home/wakeUpDb";
import { ROUTES } from "@/config/routes";
import { AlertTriangle, Home, Link, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isDBError, setIsDBError] = useState(false);
  const [status, setStatus] = useState("Đang kiểm tra lỗi...");
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 10;

  useEffect(() => {
    // BƯỚC 1: KHÁM BỆNH
    // Log lỗi ra để dev xem (quan trọng)
    console.error(error.message);
    const isConnectionIssue =
      error?.message?.includes("database") ||
      error?.message?.includes("Server");
    console.error(isConnectionIssue);
    setIsDBError(isConnectionIssue);

    // BƯỚC 2: QUYẾT ĐỊNH
    if (!isConnectionIssue) {
      // Nếu không phải lỗi mạng/DB -> Dừng lại, không làm gì cả (UI sẽ hiển thị lỗi thường)
      setStatus("Lỗi ứng dụng (Application Error)");
      return;
    }

    // Nếu ĐÚNG là lỗi DB -> Bắt đầu quy trình Polling
    let isMounted = true;

    const wakeUpDatabase = async () => {
      setStatus("Server đang khởi động (Cold Start)...");

      for (let i = 0; i < MAX_RETRIES; i++) {
        if (!isMounted) return;

        try {
          setRetryCount(i + 1);
          const res = await fetch("/api/cron"); // Gọi API check

          if (res.ok) {
            setStatus("Database đã sẵn sàng! Đang tải lại...");
            window.location.reload();
            return;
          }
        } catch (e) {
          /* Kệ lỗi */
        }

        await new Promise((r) => setTimeout(r, 3000));
      }

      setStatus("Hết thời gian chờ. Vui lòng tải lại thủ công.");
    };

    wakeUpDatabase();

    return () => {
      isMounted = false;
    };
  }, [error, reset]);

  // --- GIAO DIỆN (UI) ---

  // TRƯỜNG HỢP 1: Lỗi Code/Logic thông thường (Không phải DB ngủ)
  if (!isDBError && status !== "Đang kiểm tra lỗi...") {
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

  // TRƯỜNG HỢP 2: Lỗi do DB ngủ (Hiển thị Spinner và quy trình polling)
  return (
    <WakeUpDB
      isDBError={isDBError}
      retryCount={retryCount}
      maxRetry={MAX_RETRIES}
    />
  );
}
