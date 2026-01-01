import { Truck, ShieldCheck, RefreshCw, Bot } from "lucide-react";

const features = [
  { icon: Truck, title: "Vận chuyển miễn phí", sub: "Đơn hàng từ 500k" },
  { icon: ShieldCheck, title: "Hàng chính hãng", sub: "Cam kết 100%" },
  { icon: RefreshCw, title: "Đổi trả dễ dàng", sub: "Thủ tục nhanh gọn" },
  {
    icon: Bot,
    title: "Trợ lý ảo AI",
    sub: "Giải đáp tức thì 24/7",
  },
];

export default function ServiceFeatures() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      {features.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-3 justify-center md:justify-start"
          >
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
