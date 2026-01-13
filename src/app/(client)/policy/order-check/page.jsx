import PolicyLayout from "@/components/Layout/PolicyLayout";
import { Search } from "lucide-react";

export default function OrderCheckContent() {
  return (
    <PolicyLayout activePage={"order-check"}>
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Kiểm tra tình trạng đơn hàng</h1>
      
      {/* Search Box */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
        <form className="max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mã đơn hàng / Số điện thoại</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ví dụ: #ORD-2025-8888"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Search size={18} /> Tra cứu
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Nhập mã đơn hàng đã được gửi qua Email hoặc SMS
          </p>
        </form>
      </div>

      {/* Kết quả mẫu (Thường sẽ ẩn và chỉ hiện khi có dữ liệu) */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <span className="text-gray-500 text-sm">Đơn hàng:</span> <span className="font-bold text-gray-800">#ORD-2025-8888</span>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Đang vận chuyển
          </span>
        </div>
        <div className="p-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center">
                 {/* Ảnh SP */}
                 <span className="text-xs text-gray-400">Img</span>
              </div>
              <div>
                 <h4 className="font-medium text-gray-800">Samsung Galaxy S25 Ultra</h4>
                 <p className="text-sm text-gray-500">Màu: Titan Xám | Dung lượng: 512GB</p>
                 <p className="text-blue-600 font-bold mt-1">27.480.000 ₫</p>
              </div>
           </div>
           
           {/* Timeline vận chuyển đơn giản */}
           <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 mt-6 pb-2">
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                <p className="text-sm font-bold text-gray-800">Đơn hàng đang được giao cho ĐVVC</p>
                <p className="text-xs text-gray-500">14:30 - 25/11/2025</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                <p className="text-sm font-bold text-gray-500">Đã xác nhận đơn hàng</p>
                <p className="text-xs text-gray-500">09:15 - 25/11/2025</p>
              </div>
           </div>
        </div>
      </div>
    </div>
    </PolicyLayout>
  );
};