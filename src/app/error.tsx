"use client";

import WakeUpDB from "@/components/Home/wakeUpDb";
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Đã xảy ra lỗi!</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          {/* Ở Prod, nextjs có thể giấu message, nên hiện digest nếu có */}
          {error.message || "Lỗi không xác định."}
          {error.digest && (
            <span className="block text-xs text-gray-400 mt-1">
              Ref: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // TRƯỜNG HỢP 2: Lỗi do DB ngủ (Hiển thị Spinner và quy trình polling)
  return (
    <WakeUpDB isDBError={isDBError} retryCount={retryCount} maxRetry={MAX_RETRIES} />
  );
}
