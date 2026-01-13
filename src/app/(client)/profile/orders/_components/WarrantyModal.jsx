"use client";
import { useState, useEffect } from "react";
import { Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import ordersApi from "@/lib/api/ordersApi";

// Hàm format tiền đơn giản để hiển thị
const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );

export default function WarrantyModal({ isOpen, onClose, order }) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedItemId(null);
      setReason("");
      setMsg(null);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const orderItems = order.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId)
      return setMsg({ type: "error", text: "Vui lòng chọn sản phẩm." });
    if (!reason.trim())
      return setMsg({ type: "error", text: "Vui lòng nhập lý do." });

    try {
      setIsSubmitting(true);
      // Gọi API thực tế
      await ordersApi.requestWarranty({
        orderId: order.id,
        orderItemId: Number(selectedItemId),
        type: "warranty",
        reason,
      });

      setMsg({ type: "success", text: "Gửi yêu cầu thành công!" });
      setTimeout(onClose, 1500);
    } catch (error) {
      setMsg({ type: "error", text: error.message || "Có lỗi xảy ra." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Yêu cầu bảo hành</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {msg && (
            <div
              className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
                msg.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {msg.text}
            </div>
          )}

          <form
            id="warranty-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn sản phẩm cần hỗ trợ:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {orderItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedItemId === item.id
                        ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rma_item"
                      value={item.id}
                      checked={selectedItemId === item.id}
                      onChange={(e) =>
                        setSelectedItemId(Number(e.target.value))
                      }
                      className="mt-1 accent-blue-600"
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {item.nameSnapshot}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        SL: {item.quantity} • {formatCurrency(item.price)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả vấn đề:
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                rows={3}
                placeholder="Sản phẩm bị lỗi gì?..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="warranty-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Gửi
            yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}
