import React from "react";
import Link from "next/link";
import {
  Shield,
  RefreshCw,
  Lock,
  CreditCard,
  Truck,
  Search,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import Footer from "../Home/Footer";
import { ROUTES } from "@/config/routes";

const PolicyLayout = ({ children, activePage }) => {
  const menuItems = [
    {
      id: "warranty",
      label: "Chính sách bảo hành",
      icon: <Shield size={18} />,
      href: ROUTES.POLICY.WARRANTY,
    },
    {
      id: "return",
      label: "Chính sách đổi trả",
      icon: <RefreshCw size={18} />,
      href: ROUTES.POLICY.RETURN,
    },
    {
      id: "privacy",
      label: "Chính sách bảo mật",
      icon: <Lock size={18} />,
      href: ROUTES.POLICY.PRIVACY,
    },
    {
      id: "payment",
      label: "Quy định thanh toán",
      icon: <CreditCard size={18} />,
      href: ROUTES.POLICY.PAYMENT,
    },
    {
      id: "shipping",
      label: "Giao hàng & Lắp đặt",
      icon: <Truck size={18} />,
      href: ROUTES.POLICY.SHIPPING,
    },
    {
      id: "order-check",
      label: "Kiểm tra đơn hàng",
      icon: <Search size={18} />,
      href: ROUTES.POLICY.ORDER_CHECK,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen w-[99vw] font-sans pb-12 no-scrollbar">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 mb-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center gap-2">
          <span>Trang chủ</span> <ChevronRight size={14} />
          <span>Hỗ trợ khách hàng</span> <ChevronRight size={14} />
          <span>{activePage}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden top-4">
              <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-800">
                Danh mục hỗ trợ
              </div>
              <ul className="flex flex-col">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-gray-50
                        ${
                          item.id === activePage
                            ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 font-medium"
                            : "text-gray-600 border-l-4 border-transparent"
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact box */}
            <div className="mt-6 bg-blue-600 text-white rounded-lg p-5 shadow-md">
              <h4 className="font-bold mb-2">Cần hỗ trợ gấp?</h4>
              <p className="text-blue-100 text-sm mb-4">
                Liên hệ với chúng tôi 24/7
              </p>
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Phone size={16} /> 1900 1234
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Mail size={16} /> hotro@ecomstore.vn
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10 h-[90vh] overflow-y-auto no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PolicyLayout;
