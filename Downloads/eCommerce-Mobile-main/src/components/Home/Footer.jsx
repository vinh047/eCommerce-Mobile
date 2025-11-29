import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200 font-sans">
      <div className="container mx-auto px-4">
        {/* Top Section: 3 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Cột 1: Thông tin công ty */}
          <div style={{ paddingLeft: "50px" }}>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1 rounded">E-Com</span>{" "}
              Store
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Hệ thống bán lẻ điện thoại, máy tính, phụ kiện chính hãng uy tín
              hàng đầu. Cam kết chất lượng 100%.
            </p>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold block text-gray-800">Trụ sở chính:</span>
                  123 Đường 3/2, Quận 10, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-600 flex-shrink-0" />
                <span>1900 1234 (8:00 - 21:30)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-600 flex-shrink-0" />
                <span>hotro@ecomstore.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Chính sách & Quy định */}
          <div style={{ paddingLeft: "100px" }} className="md:pl-8">
            <h3 className="text-gray-800 font-bold mb-6 text-lg">
              Chính sách & Quy định
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a
                  href="/policy/warranty"
                  className="hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a
                  href="/policy/return"
                  className="hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="/policy/privacy"
                  className="hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hệ thống chi nhánh (Mới) */}
          <div>
            <h3 className="text-gray-800 font-bold mb-6 text-lg">
              Hệ thống chi nhánh
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-800">Chi nhánh Hà Nội</span>
                  <span>456 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-800">Chi nhánh Đà Nẵng</span>
                  <span>789 Nguyễn Văn Linh, Q. Thanh Khê</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-800">Chi nhánh Cần Thơ</span>
                  <span>101 Đường 30/4, Q. Ninh Kiều</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 E-Com Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;