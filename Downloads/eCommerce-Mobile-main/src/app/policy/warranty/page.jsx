import React from 'react';

// Component Layout thay thế đơn giản để hiển thị nội dung mà không cần file bên ngoài
const PolicyLayout = ({ children, activePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar giả lập */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Chính sách & Quy định</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className={`block px-4 py-2 rounded-lg text-sm ${activePage === 'warranty' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
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

export default function WarrantyPolicyContent() {
  return (
    <PolicyLayout activePage={"warranty"}>
      <div className="text-gray-700 leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Chính sách bảo hành
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Cập nhật lần cuối: 25/11/2025
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
              1. Thời gian bảo hành
            </h2>
            <p className="mb-4">
              Tất cả sản phẩm bán ra tại E-Com Store đều được cam kết bảo hành
              chính hãng. Thời gian bảo hành được tính từ ngày kích hoạt bảo
              hành điện tử hoặc ngày mua hàng.
            </p>

            {/* Table Design */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-bold uppercase">
                  <tr>
                    <th className="px-6 py-3">Loại sản phẩm</th>
                    <th className="px-6 py-3">Thời hạn bảo hành</th>
                    <th className="px-6 py-3">Hình thức</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">Điện thoại iPhone</td>
                    <td className="px-6 py-4">12 Tháng</td>
                    <td className="px-6 py-4">Chính hãng Apple VN</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      Điện thoại Samsung
                    </td>
                    <td className="px-6 py-4">12 - 18 Tháng</td>
                    <td className="px-6 py-4">Tại TTBH Samsung</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      Phụ kiện (Cáp, sạc)
                    </td>
                    <td className="px-6 py-4">06 Tháng</td>
                    <td className="px-6 py-4">1 đổi 1 tại Shop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
              2. Điều kiện từ chối bảo hành
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Sản phẩm đã hết thời hạn bảo hành.</li>
              <li>
                Sản phẩm bị hư hỏng do rơi vỡ, va đập, trầy xước, móp méo, ẩm
                ướt, hoen rỉ hoặc chảy nước.
              </li>
              <li>
                Sản phẩm có dấu hiệu hư hỏng do chuột bọ hoặc côn trùng xâm
                nhập.
              </li>
              <li>
                Sản phẩm đã bị tháo dỡ, sửa chữa bởi các nơi không phải là Trung
                tâm Bảo hành của Hãng.
              </li>
            </ul>
          </section>

          {/* Contact Support Box - NEW ADDITION */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg mt-6">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Lưu ý:</strong> Đối với các sản phẩm đổi trả, quý khách
              vui lòng giữ lại vỏ hộp và đầy đủ phụ kiện đi kèm để được hỗ trợ
              tốt nhất.
            </p>
            <div className="border-t border-blue-200 mt-3 pt-3">
              <p className="text-base text-blue-900 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hỗ trợ bảo hành
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Mọi chi tiết bảo hành xin liên hệ số điện thoại/zalo: <span className="font-bold text-red-600 text-base">0973084121</span> để được hướng dẫn bảo hành.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}