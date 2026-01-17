"use client";

import inventoryApi from "@/lib/api/inventoryApi";
import { X, Calendar, User, Package, Hash, Tag } from "lucide-react"; // Thêm Tag
import { useEffect, useState, useMemo } from "react";

export default function TransactionDetailModal({ ticket, onClose }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Khởi tạo trạng thái chi tiết (sử dụng ticket ban đầu nếu có)
  const [detailTicket, setDetailTicket] = useState(ticket);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!ticket?.id) return;

      setIsLoading(true);
      try {
        const data = await inventoryApi.getTransactionById(ticket.id);
        console.log(data)
        setDetailTicket(data);
      } catch (error) {
        console.error("Lỗi khi fetch chi tiết phiếu kho:", error);
        // Có thể thêm logic hiển thị lỗi cho người dùng ở đây
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticket.id]);

  // Dùng useMemo để tính toán tổng thiết bị và danh sách thiết bị
  const { totalQuantity, allDevices } = useMemo(() => {
    if (!detailTicket || !detailTicket.transactions) {
      return { totalQuantity: 0, allDevices: [] };
    }

    let totalQuantity = 0;
    let allDevices = [];

    detailTicket.transactions.forEach((txn) => {
      totalQuantity += txn.quantity;
      // SỬA LỖI: Đảm bảo txn.devices là một mảng trước khi gọi forEach
      (txn.devices || []).forEach((txnDevice) => {
        if (txnDevice.device) {
          allDevices.push({
            ...txnDevice.device,
            variant: txn.variant, // Thêm thông tin variant vào device để dễ tra cứu
          });
        }
      });
    });

    return { totalQuantity, allDevices };
  }, [detailTicket]);

  if (isLoading || !detailTicket) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 p-10 bg-white rounded-xl shadow-2xl dark:bg-gray-800">
          <p className="text-lg font-medium dark:text-white">
            Đang tải chi tiết phiếu...
          </p>
        </div>
      </div>
    );
  }

  // Lấy danh sách các transactions (dòng sản phẩm)
  const transactionsList = detailTicket.transactions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Chi tiết phiếu: {detailTicket?.code || "N/A"}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                detailTicket?.type === "in"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {detailTicket?.type === "in" ? "NHẬP KHO" : "XUẤT KHO"}
            </span>
            <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
              (ID: #{detailTicket?.id || "N/A"})
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto">
          {/* Info Block - Ẩn chi tiết sản phẩm đơn lẻ, hiển thị thông tin phiếu */}
          <div className="grid grid-cols-3 gap-6 mb-6 pb-4 border-b dark:border-gray-700">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Thời gian tạo
              </p>
              <p className="font-medium dark:text-white">
                {formatDate?.(detailTicket?.createdAt) || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center">
                <User className="w-4 h-4 mr-1" /> Người tạo
              </p>
              <p className="font-medium dark:text-white">
                {detailTicket?.staff?.name || "N/A"}
              </p>
              <p className="text-xs text-gray-400">
                {detailTicket?.staff?.email || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center">
                <Tag className="w-4 h-4 mr-1" /> Tổng số lượng
              </p>
              <p className="font-medium text-xl dark:text-white">
                {totalQuantity ?? 0}{" "}
                {/* totalQuantity có thể là 0, null, hoặc undefined */}
              </p>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="mb-6 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-1">Lý do / Ghi chú</p>
            <p className="font-medium dark:text-white italic text-sm">
              {detailTicket?.note || "Không có ghi chú"}
            </p>
          </div>

          {/* -------------------- Danh sách Dòng Sản Phẩm (Transactions) -------------------- */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center dark:text-white text-lg border-b pb-2">
              <Package className="w-5 h-5 mr-2" />
              {/* SỬA LỖI #1: Xử lý transactionsList là null/undefined */}
              Chi tiết các dòng sản phẩm ({transactionsList?.length ?? 0})
            </h4>

            {/* SỬA LỖI #2: Đảm bảo lặp qua mảng rỗng nếu transactionsList là null/undefined */}
            {(transactionsList || []).map((txn, txnIndex) => (
              <div
                key={txn.id}
                className="mb-4 p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
              >
                <p className="font-bold text-base dark:text-white mb-2">
                  {txnIndex + 1}.{" "}
                  {txn.variant?.product?.name || "Sản phẩm không xác định"}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {" "}
                    (Biến thể: {txn.variant?.id || "N/A"} )
                  </span>
                </p>
                <div className="flex space-x-1 items-center text-sm mb-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    Số lượng:
                  </span>
                  <span className="font-semibold dark:text-white">
                    {txn.quantity ?? 0}
                  </span>
                </div>

                {/* Devices List Table cho từng transaction */}
                <div className="mt-4">
                  <h5 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    {/* SỬA LỖI #3: Xử lý txn.devices là null/undefined */}
                    Devices ({txn.devices?.length ?? 0})
                  </h5>
                  <div className="bg-white dark:bg-gray-900 rounded border dark:border-gray-700 max-h-48 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 uppercase sticky top-0">
                        <tr>
                          <th className="px-3 py-1">STT</th>
                          <th className="px-3 py-1">Serial / IMEI</th>
                          <th className="px-3 py-1">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* SỬA LỖI #4: Đảm bảo lặp qua mảng rỗng nếu txn.devices là null/undefined */}
                        {(txn.devices || []).map((item, index) => (
                          <tr
                            key={item.device?.id || index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-3 py-1.5 text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-3 py-1.5 font-mono font-medium dark:text-white">
                              {item.device?.identifier || "N/A"}
                            </td>
                            <td className="px-3 py-1.5">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                                {item.device?.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* SỬA LỖI #5: Kiểm tra txn.devices?.length an toàn */}
                        {txn.devices?.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-3 py-2 text-center text-gray-500 italic"
                            >
                              Không có thiết bị (serial) cho dòng này.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
