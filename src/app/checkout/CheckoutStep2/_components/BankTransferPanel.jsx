import { Copy } from "lucide-react";
import { formatCurrency } from "../../CheckoutStep1/utils/utils";
import { Button } from "@/components/ui/form/Button";
import { toast } from "sonner";

export default function BankTransferPanel({
  method,
  total,
  generatingQr,
  qrUrl,
  orderCode,
}) {
  const account = method.accounts?.[0];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!");
  };

  return (
    <div className="mt-6 animate-in fade-in slide-in-from-top-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Phần thông tin tài khoản */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            Thông tin chuyển khoản
          </h4>
          
          {account ? (
            <div className="space-y-4 text-sm">
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                <div className="text-gray-500 text-xs uppercase font-medium mb-1">Ngân hàng</div>
                <div className="font-semibold text-gray-900">{account.bankName}</div>
                {account.bankBranch && <div className="text-xs text-gray-400">{account.bankBranch}</div>}
              </div>

              <div className="flex gap-4">
                <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex-1 cursor-pointer group" onClick={() => copyToClipboard(account.accountNumber)}>
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1 flex justify-between">
                    Số tài khoản <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                  <div className="font-mono font-bold text-lg text-blue-600 tracking-wider">
                    {account.accountNumber}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex-1">
                  <div className="text-gray-500 text-xs uppercase font-medium mb-1">Chủ tài khoản</div>
                  <div className="font-semibold text-gray-900 uppercase">{account.accountName}</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm cursor-pointer group" onClick={() => copyToClipboard(total)}>
                 <div className="text-gray-500 text-xs uppercase font-medium mb-1 flex justify-between">
                    Số tiền cần chuyển <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                 </div>
                 <div className="font-bold text-xl text-red-600">
                    {formatCurrency(total)}
                 </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Đang cập nhật thông tin...</p>
          )}
        </div>

        {/* Phần QR Code */}
        <div className="bg-white p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-blue-200 min-w-[300px]">
          {generatingQr ? (
            <div className="h-48 w-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400 text-sm">
              Đang tạo mã QR...
            </div>
          ) : qrUrl ? (
            <>
              <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
                <img src={qrUrl} alt="VietQR" className="w-48 h-48 object-contain rounded-lg" />
              </div>
              <p className="text-xs text-center text-gray-500 mt-4 max-w-[200px]">
                Mở ứng dụng ngân hàng và quét mã để thanh toán tự động
              </p>
              {orderCode && (
                 <div className="mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-600">
                    Mã đơn: {orderCode}
                 </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm">
                Vui lòng chọn phương thức thanh toán
            </div>
          )}
        </div>
      </div>
    </div>
  );
}