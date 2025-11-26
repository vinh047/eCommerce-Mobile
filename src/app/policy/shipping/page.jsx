import PolicyLayout from "@/components/Layout/PolicyLayout";

export default function ShippingPolicyContent() {
  return (
    <PolicyLayout activePage={"shipping"}>
      <div className="text-gray-700 leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Vận chuyển & Lắp đặt
        </h1>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            1. Biểu phí giao hàng
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-bold">
                <tr>
                  <th className="px-4 py-3">Khoảng cách</th>
                  <th className="px-4 py-3">Đơn hàng {">"} 500k</th>
                  <th className="px-4 py-3">Đơn hàng {"<"} 500k</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3">Nội thành (&lt; 10km)</td>
                  <td className="px-4 py-3 text-green-600 font-bold">
                    Miễn phí
                  </td>
                  <td className="px-4 py-3">20.000đ</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Ngoại thành (&lt; 30km)</td>
                  <td className="px-4 py-3">30.000đ</td>
                  <td className="px-4 py-3">50.000đ</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Liên tỉnh</td>
                  <td className="px-4 py-3" colSpan={2}>
                    Tính theo phí bưu điện (GHTK, Viettel Post...)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            2. Thời gian giao hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-800 mb-1">
                Giao hàng hỏa tốc (2H)
              </p>
              <p className="text-sm text-gray-500">
                Áp dụng cho nội thành TP.HCM và Hà Nội. Đặt trước 18:00 hàng
                ngày.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-800 mb-1">
                Giao hàng tiêu chuẩn
              </p>
              <p className="text-sm text-gray-500">
                - Nội miền: 1-2 ngày
                <br />
                - Cận miền: 2-3 ngày
                <br />- Liên miền: 3-5 ngày
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            3. Chính sách lắp đặt & Cài đặt
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
            <li>
              Miễn phí cài đặt phần mềm cơ bản (Windows, Office, Driver...) trọn
              đời máy cho Laptop/PC.
            </li>
            <li>
              Hỗ trợ chép dữ liệu, tạo tài khoản miễn phí cho Điện thoại/Tablet.
            </li>
            <li>
              Đối với Tivi/Tủ lạnh/Máy giặt: Miễn phí công lắp đặt (không bao
              gồm vật tư phát sinh như ống đồng, giá treo...).
            </li>
          </ul>
        </section>
      </div>
    </PolicyLayout>
  );
}
