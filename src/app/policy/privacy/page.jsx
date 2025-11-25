import PolicyLayout from "@/components/Layout/PolicyLayout";

export default function PrivacyPolicyContent() {
  return (
    <PolicyLayout activePage={"privacy"}>
      <div className="text-gray-700 leading-relaxed text-sm md:text-base">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Chính sách bảo mật thông tin
        </h1>
        <p className="mb-6 italic text-gray-500">
          E-Com Store cam kết bảo mật tuyệt đối thông tin cá nhân của Quý khách
          theo chính sách bảo vệ thông tin cá nhân của pháp luật và quy định của
          công ty.
        </p>

        <div className="space-y-6">
          <article>
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">
              1. Mục đích thu thập thông tin
            </h3>
            <p className="mb-2">
              Chúng tôi thu thập thông tin cá nhân chỉ nhằm mục đích phục vụ cho
              việc:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Xử lý đơn hàng và giao hàng.</li>
              <li>Thông báo về việc giao hàng và hỗ trợ khách hàng.</li>
              <li>
                Cung cấp thông tin liên quan đến sản phẩm (khuyến mãi, bảo
                hành).
              </li>
              <li>
                Xử lý các đơn đặt hàng và cung cấp dịch vụ thông qua trang web
                của chúng tôi.
              </li>
            </ul>
          </article>

          <article>
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">
              2. Phạm vi thu thập
            </h3>
            <p className="mb-2">Các thông tin thu thập bao gồm:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Họ tên, Giới tính, Ngày sinh.</li>
              <li>Địa chỉ giao hàng, Địa chỉ email, Số điện thoại di động.</li>
            </ul>
          </article>

          <article>
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">
              3. Thời gian lưu trữ
            </h3>
            <p className="text-gray-600">
              Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu
              cầu hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn
              lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo
              mật trên máy chủ của E-Com Store.
            </p>
          </article>

          <article>
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">
              4. Cam kết bảo mật
            </h3>
            <p className="text-gray-600 mb-2">
              Chúng tôi cam kết không chia sẻ, bán hoặc cho thuê thông tin cá
              nhân của bạn cho bất kỳ bên thứ ba nào ngoại trừ các đơn vị vận
              chuyển (để giao hàng).
            </p>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800 text-sm">
              <strong>Khuyến cáo:</strong> Quý khách không nên trao đổi những
              thông tin thanh toán, mật khẩu của mình cho bên thứ 3 nào khác để
              tránh rò rỉ thông tin.
            </div>
          </article>
        </div>
      </div>
    </PolicyLayout>
  );
}
