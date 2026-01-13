import Lottie from "lottie-react";
import notFound from "../../../public/assets/sleep.json";
import { ROUTES } from "@/config/routes";

interface WakeUpDBProps {
  status?: string;
  retryCount?: number;
  maxRetry?: number;
  isDBError?: boolean;
  onRetry?: () => void;
  href?: string;
}

const WakeUpDB: React.FC<WakeUpDBProps> = ({
  status = "Đang khởi tạo hệ thống...",
  retryCount = 0,
  maxRetry = 20,
  isDBError = false,
  onRetry,
  href = ROUTES.HOME,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Animation */}
      <div className="relative mb-2 h-96 w-96 sm:h-[500px] sm:w-[600px]">
        <Lottie animationData={notFound} loop autoplay />
      </div>

      {/* Text */}
      <div className="mt-10 text-center">
        <h2 className="text-4xl font-bold text-gray-700">{status}</h2>

        <p className="mt-3 text-lg text-gray-600">
          Hệ thống sẽ tự động tiếp tục khi sẵn sàng.
        </p>

        {isDBError && (
          <p className="text-sm text-gray-500">
            Đang thiết lập lại kết nối dữ liệu ( Lần thử {retryCount}/{maxRetry} )
          </p>
        )}

        <a
          href={href}
          className="mt-6 inline-block rounded-lg px-6 py-3 font-medium shadow-lg transition-transform hover:scale-105 hover:bg-green-200"
        >
          Thử lại
        </a>
      </div>
    </div>
  );
};

export default WakeUpDB;
