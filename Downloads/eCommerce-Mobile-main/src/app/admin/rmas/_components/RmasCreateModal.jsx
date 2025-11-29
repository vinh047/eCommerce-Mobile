"use client";

import { useState } from "react";
import { X, Search, Package, CheckCircle, AlertCircle } from "lucide-react";
import ordersApi from "@/lib/api/ordersApi"; // Cần dùng API Order để tìm đơn

export default function RmaCreateModal({ onClose, onSave }) {
  const [step, setStep] = useState(1); // 1: Find Order, 2: Select Item & Reason
  const [orderCode, setOrderCode] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Form data cho bước 2
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [rmaType, setRmaType] = useState("return");
  const [reason, setReason] = useState("");

  // Hàm tìm đơn hàng
  const handleSearchOrder = async () => {
    if (!orderCode.trim()) return;
    setIsSearching(true);
    setError("");
    setFoundOrder(null);

    try {
      // Gọi API tìm đơn hàng (Giả định API orders hỗ trợ search)
      const res = await ordersApi.getOrders({ search: orderCode });

      // Lọc chính xác mã đơn (vì API search có thể trả về gần đúng)
      const match = res.data.find(
        (o) => o.code.toLowerCase() === orderCode.toLowerCase()
      );

      if (match) {
        // Vì API list thường không trả full items, cần gọi API detail để lấy items
        const detailRes = await ordersApi.getOrderById(match.id);
        setFoundOrder(detailRes);
        setStep(2);
      } else {
        setError("Không tìm thấy đơn hàng với mã này.");
      }
    } catch (err) {
      setError("Lỗi khi tìm đơn hàng.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemId) return alert("Vui lòng chọn sản phẩm cần xử lý");

    const payload = {
      orderId: foundOrder.id,
      orderItemId: Number(selectedItemId),
      type: rmaType,
      reason: reason,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tạo yêu cầu RMA mới
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: FIND ORDER */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium dark:text-gray-300">
                Nhập Mã đơn hàng
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="VD: ORD-123456"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchOrder()}
                />
                <button
                  onClick={handleSearchOrder}
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center"
                >
                  {isSearching ? (
                    "Đang tìm..."
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" /> Tìm
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
              )}
            </div>
          )}

          {/* STEP 2: SELECT ITEM & REASON */}
          {step === 2 && foundOrder && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Đơn hàng: {foundOrder.code}
                </p>
                <p className="text-blue-600 dark:text-blue-300">
                  Khách hàng: {foundOrder.user?.name || "Khách vãng lai"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Chọn sản phẩm cần xử lý *
                </label>
                <div className="border rounded-lg dark:border-gray-600 max-h-40 overflow-y-auto">
                  {foundOrder.items.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-0 dark:border-gray-700 ${
                        selectedItemId == item.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="orderItem"
                        value={item.id}
                        checked={selectedItemId == item.id}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">
                          {item.nameSnapshot}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Number(item.price).toLocaleString()} ₫ x{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Loại yêu cầu
                  </label>
                  <select
                    value={rmaType}
                    onChange={(e) => setRmaType(e.target.value)}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="return">Trả hàng / Hoàn tiền</option>
                    <option value="exchange">Đổi hàng mới</option>
                    <option value="repair">Bảo hành / Sửa chữa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Lý do / Ghi chú *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="VD: Sản phẩm bị lỗi nguồn..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:underline"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Tạo yêu cầu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
