import { Button } from "@/components/ui/form/Button";
import { formatCurrency } from "../../CheckoutStep1/utils/utils";

export default function BankTransferPanel({
  method,
  total,
  generatingQr,
  qrUrl,
  orderCode,
}) {
  const account =
    method.accounts && method.accounts.length > 0 ? method.accounts[0] : null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="font-medium mb-2">Chuyển khoản ngân hàng</div>

      {account ? (
        <div className="text-sm text-gray-700 mb-3">
          <div>
            <strong>{account.accountName}</strong>
          </div>
          <div>
            Số tài khoản:{" "}
            <span className="font-mono">{account.accountNumber}</span>
          </div>
          <div>
            Ngân hàng: {account.bankName}{" "}
            {account.bankBranch ? `- ${account.bankBranch}` : ""}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mb-3">
          Không có tài khoản nhận tiền.
        </div>
      )}

      {generatingQr && (
        <div className="text-sm text-gray-600 mb-2">Đang tạo mã QR…</div>
      )}

      {qrUrl && (
        <div className="mt-2">
          <div className="text-sm text-gray-600 mb-2">
            Quét mã QR để chuyển khoản (số tiền: {formatCurrency(total)})
          </div>
          <img
            src={qrUrl}
            alt="VietQR"
            className="w-full max-w-xs h-auto object-contain border rounded"
          />
          <div className="text-xs text-gray-500 mt-2">
            Mã giao dịch tham chiếu: {orderCode}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Sau khi chuyển khoản xong, quay lại bấm{" "}
            <strong>&quot;Đặt hàng&quot;</strong> để xác nhận và tạo đơn.
          </div>
        </div>
      )}
    </div>
  );
}
