import PolicyLayout from "@/components/Layout/PolicyLayout";

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

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-6">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Đối với các sản phẩm đổi trả, quý khách
              vui lòng giữ lại vỏ hộp và đầy đủ phụ kiện đi kèm để được hỗ trợ
              tốt nhất.
            </p>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
