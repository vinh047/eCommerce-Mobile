import React from 'react';

// Component Layout thay thế đơn giản để hiển thị nội dung mà không cần file bên ngoài
// Giúp tránh lỗi import khi chạy
const PolicyLayout = ({ children, activePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar giả lập */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Chính sách & Quy định</h3>
          <ul className="space-y-2">
            <li>
              <a href="/policy/warranty" className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="/policy/return" className={`block px-4 py-2 rounded-lg text-sm ${activePage === 'return' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="/policy/privacy" className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </aside>
        
        {/* Nội dung chính */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ReturnPolicyContent() {
  return (
    <PolicyLayout activePage={"return"}>
      <div className="text-gray-700 leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Chính sách đổi trả</h1>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded-r-lg">
          <p className="text-sm font-medium text-blue-800">
            Cam kết "1 Đổi 1" trong vòng 30 ngày nếu có lỗi từ nhà sản xuất đối với tất cả sản phẩm điện thoại, laptop, máy tính bảng.
          </p>
        </div>

        <div className="space-y-8">
          {/* Mục 1: Điều kiện */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">1</span>
              Điều kiện đổi trả
            </h2>
            <ul className="list-disc pl-9 space-y-2 text-gray-600 text-sm">
              <li>Máy không bị trầy xước, cấn móp, nứt vỡ, vào nước (Thẩm định bởi kỹ thuật viên).</li>
              <li>Còn đầy đủ hộp, phụ kiện đi kèm (cáp, sạc, tai nghe, sách hướng dẫn, cây lấy sim...).</li>
              <li>Máy còn nguyên tem bảo hành (nếu có) và quà tặng đi kèm (nếu có).</li>
              <li>Tài khoản cá nhân (iCloud, Samsung Account, Google...) đã được đăng xuất hoàn toàn.</li>
            </ul>
          </section>

          {/* Mục 2: Phí đổi trả */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">2</span>
              Phí đổi trả (Nếu đổi theo nhu cầu)
            </h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg ml-8">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 font-bold">
                     <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Máy lỗi NSX</th>
                        <th className="p-3">Máy không lỗi (Đổi ý)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                     <tr>
                        <td className="p-3">1 - 30 ngày</td>
                        <td className="p-3 text-green-600 font-bold">Miễn phí</td>
                        <td className="p-3">Trừ 20% giá trị máy</td>
                     </tr>
                     <tr>
                        <td className="p-3">Sau 30 ngày</td>
                        <td className="p-3">Gửi bảo hành hãng</td>
                        <td className="p-3">Thu mua theo giá thị trường</td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </section>

          {/* Mục 3: Quy trình */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">3</span>
              Quy trình thực hiện
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
               <div className="p-4 border rounded-lg bg-gray-50 text-center">
                  <div className="font-bold text-gray-800 mb-1">Bước 1</div>
                  <p className="text-xs text-gray-500">Mang máy ra cửa hàng gần nhất hoặc gửi chuyển phát nhanh.</p>
               </div>
               <div className="p-4 border rounded-lg bg-gray-50 text-center">
                  <div className="font-bold text-gray-800 mb-1">Bước 2</div>
                  <p className="text-xs text-gray-500">Kỹ thuật viên kiểm tra tình trạng máy và định giá (nếu có).</p>
               </div>
               <div className="p-4 border rounded-lg bg-gray-50 text-center">
                  <div className="font-bold text-gray-800 mb-1">Bước 3</div>
                  <p className="text-xs text-gray-500">Hoàn tiền hoặc đổi sản phẩm mới ngay lập tức.</p>
               </div>
            </div>
          </section>

          {/* Thông tin liên hệ - Mới thêm vào */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-700">
              Mọi chi tiết đổi trả xin liên hệ số điện thoại/zalo: <span className="font-bold text-red-600 text-base">0973084121</span> để được hướng dẫn đổi trả.
            </p>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
};