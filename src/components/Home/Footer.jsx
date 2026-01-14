import React from "react";
import Link from "next/link"; // Import Link từ Next.js
import {
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200 font-sans">
      <div className="container mx-auto px-4">
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Cột 1: Thông tin công ty */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1 rounded">E-Com</span>{" "}
              Store
            </h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Hệ thống bán lẻ điện thoại, máy tính, phụ kiện chính hãng uy tín
              hàng đầu. Cam kết chất lượng 100%.
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-0.5" />
                <span>123 Đường 3/2, Quận 10, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-600" />
                <span>1900 1234 (8:00 - 21:30)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600" />
                <span>hotro@ecomstore.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Chính sách */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">
              Chính sách & Quy định
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href={ROUTES.POLICY.WARRANTY}
                  className="hover:text-blue-600 transition-colors"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.POLICY.RETURN}
                  className="hover:text-blue-600 transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.POLICY.PRIVACY}
                  className="hover:text-blue-600 transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.POLICY.PAYMENT}
                  className="hover:text-blue-600 transition-colors"
                >
                  Quy định thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.POLICY.SHIPPING}
                  className="hover:text-blue-600 transition-colors"
                >
                  Giao hàng & Lắp đặt
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.POLICY.ORDER_CHECK}
                  className="hover:text-blue-600 transition-colors"
                >
                  Kiểm tra đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Về chúng tôi & Hỗ trợ */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href="/about/company"
                  className="hover:text-blue-600 transition-colors"
                >
                  Giới thiệu công ty
                </Link>
              </li>
              <li>
                <Link
                  href="/about/careers"
                  className="hover:text-blue-600 transition-colors"
                >
                  Tuyển dụng nhân tài
                </Link>
              </li>
              <li>
                <Link
                  href="/about/feedback"
                  className="hover:text-blue-600 transition-colors"
                >
                  Gửi góp ý, khiếu nại
                </Link>
              </li>
              <li>
                <Link
                  href="/about/stores"
                  className="hover:text-blue-600 transition-colors"
                >
                  Tìm siêu thị (20 shop)
                </Link>
              </li>
            </ul>

            {/* Payment Methods Badges */}
            <h3 className="text-gray-800 font-bold mt-6 mb-3 text-sm">
              Thanh toán
            </h3>
            <div className="flex gap-2 flex-wrap">
              <div className="px-2 h-6 bg-white border rounded flex items-center justify-center text-xs font-bold text-green-600">
                COD
              </div>
              <div className="w-10 h-6 bg-white border rounded flex items-center justify-center text-xs font-bold text-blue-800">
                VISA
              </div>
              <div className="w-10 h-6 bg-white border rounded flex items-center justify-center text-xs font-bold text-red-600">
                MC
              </div>
              <div className="w-12 h-6 bg-white border rounded flex items-center justify-center text-xs font-bold text-purple-600">
                MoMo
              </div>
              <div className="px-2 h-6 bg-white border rounded flex items-center justify-center text-xs font-bold text-indigo-600">
                Bank
              </div>
            </div>
          </div>

          {/* Cột 4: Đăng ký & Mạng xã hội */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">Đăng ký nhận tin</h3>
            <p className="text-gray-500 text-sm mb-4">
              Nhận thông tin khuyến mãi và voucher mới nhất qua email.
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                <Send size={18} />
              </button>
            </div>

            <h3 className="text-gray-800 font-bold mb-3 text-sm">
              Kết nối với chúng tôi
            </h3>
            <div className="flex gap-4">
              {/* Mạng xã hội là link ngoài nên giữ thẻ a hoặc dùng Link target="_blank" */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2025 E-Com Store. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-blue-600">
              Điều khoản
            </Link>
            <Link href={ROUTES.POLICY.PRIVACY} className="hover:text-blue-600">
              Bảo mật
            </Link>
            <Link href="/cookies" className="hover:text-blue-600">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
