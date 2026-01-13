import PolicyLayout from "@/components/Layout/PolicyLayout";
import { CreditCard, Wallet, Banknote } from "lucide-react"; // Import icon nếu cần

export default function PaymentPolicyContent() {
  return (
    <PolicyLayout activePage={"payment"}>
      <div className="text-gray-700 leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Phương thức thanh toán
        </h1>

        <div className="grid gap-6">
          {/* Phương thức 1: Tiền mặt */}
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <Banknote size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Thanh toán tiền mặt (COD)
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Áp dụng cho đơn hàng dưới 50.000.000đ. Quý khách thanh toán
                  trực tiếp cho nhân viên giao hàng khi nhận sản phẩm.
                </p>
              </div>
            </div>
          </div>

          {/* Phương thức 2: Chuyển khoản */}
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <CreditCard size={24} />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-gray-800 text-lg">
                  Chuyển khoản ngân hàng
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Miễn phí phí giao dịch. Nội dung chuyển khoản:{" "}
                  <strong>[Tên Khách Hàng] + [SĐT]</strong>
                </p>

                {/* Box thông tin tài khoản - Nên làm nổi bật */}
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Tài khoản thụ hưởng
                  </p>
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <p className="text-gray-600 text-xs">Ngân hàng</p>
                      <p className="font-bold text-gray-800">
                        Vietcombank (VCB)
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Số tài khoản</p>
                      <p className="font-bold text-blue-600 text-lg tracking-wider">
                        0071 0000 12345
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Chủ tài khoản</p>
                      <p className="font-bold text-gray-800 uppercase">
                        Cong Ty E-Com Store
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phương thức 3: Trả góp */}
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Trả góp 0% lãi suất
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Hỗ trợ trả góp qua thẻ tín dụng (Visa/Mastercard/JCB) của 25
                  ngân hàng hoặc qua các công ty tài chính (HomeCredit, FE
                  Credit).
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
                    Visa
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
                    Mastercard
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
                    JCB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
