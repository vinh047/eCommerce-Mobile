"use client";

import { useState, useMemo, useEffect } from "react";
import {
  X,
  ShoppingBag,
  CreditCard,
  User,
  Plus,
  Trash2,
  FileText,
  Truck,
  AlertCircle,
  Loader2, // Thêm icon loading cho đẹp
} from "lucide-react";
import ordersApi from "@/lib/api/ordersApi";

// Helper format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function OrdersModal({ mode, order, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  // State form data khởi tạo mặc định (dùng cho trường hợp tạo mới)
  const [formData, setFormData] = useState({
    code: order?.code || `ORD-${Date.now()}`,
    userId: order?.userId || "",
    status: order?.status || "pending",
    paymentStatus: order?.paymentStatus || "pending",
    shippingStatus: order?.shippingStatus || "pending",
    note: order?.note || "",
    items: order?.items || [],
    discount: order?.discount || 0,
    shippingFee: order?.shippingFee || 0,
  });

  // useEffect: Fetch dữ liệu chi tiết và ĐỒNG BỘ VÀO FORM
  useEffect(() => {
    const fetchOrderDetail = async () => {
      // Nếu là mode create hoặc không có ID thì không cần fetch
      if (mode === "create" || !order?.id) return;

      setIsLoading(true);
      try {
        const data = await ordersApi.getOrderById(order.id);

        console.log("Dữ liệu chi tiết lấy về:", data);

        // --- QUAN TRỌNG: Cập nhật state của Form ngay khi có data mới ---
        setFormData({
          code: data.code || order.code, // Giữ code cũ nếu api thiếu
          userId: data.userId || data.user?.id || "", // Xử lý trường hợp data trả về object user
          status: data.status || "pending",
          paymentStatus: data.paymentStatus || "pending",
          shippingStatus: data.shippingStatus || "",
          note: data.note || "",
          items: data.items || [],
          discount: data.discount || 0,
          shippingFee: data.shippingFee || 0,
        });
        // ---------------------------------------------------------------
      } catch (error) {
        console.error("Lỗi khi fetch chi tiết đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [order?.id, mode]); // Thêm mode vào dependency

  // Tính toán Total realtime
  const { subtotal, total } = useMemo(() => {
    const sub = formData.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const final =
      sub + Number(formData.shippingFee || 0) - Number(formData.discount || 0);
    return { subtotal: sub, total: final > 0 ? final : 0 };
  }, [formData.items, formData.shippingFee, formData.discount]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "quantity" && Number(value) < 1) return;

    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // const removeItem = (index) => {
  //   const newItems = formData.items.filter((_, i) => i !== index);
  //   setFormData((prev) => ({ ...prev, items: newItems }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, total, subtotal });
  };

  const tabs = [
    { id: "info", name: "Thông tin chung", icon: User },
    { id: "items", name: "Sản phẩm & Giá", icon: ShoppingBag },
    { id: "payment", name: "Thanh toán & Vận chuyển", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border dark:border-gray-700">
        {/* Loading Overlay khi đang fetch dữ liệu */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/70 dark:bg-gray-800/70 flex flex-col items-center justify-center backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Đang tải dữ liệu đơn hàng...
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {mode === "create" ? (
                <Plus className="w-5 h-5 text-blue-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
              {mode === "create"
                ? "Tạo đơn hàng mới"
                : `Cập nhật đơn: ${formData.code}`}
            </h3>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
              {mode === "create"
                ? "Tạo đơn hàng thủ công"
                : "Cập nhật thông tin và trạng thái đơn hàng"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center transition-all relative ${
                  isActive
                    ? "text-blue-600 bg-white dark:bg-gray-800 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full mx-6"></span>
                )}
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Main Content Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/30"
        >
          {/* TAB: INFO */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                  Thông tin khách hàng
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">
                      ID Khách hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="number" // Hoặc text tùy id của bạn
                        required
                        value={formData.userId}
                        onChange={(e) =>
                          handleInputChange("userId", e.target.value)
                        }
                        className="w-full pl-9 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Nhập ID..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">
                  Ghi chú nội bộ
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  rows={4}
                  placeholder="Ghi chú về đơn hàng..."
                />
              </div>
            </div>
          )}

          {/* TAB: ITEMS */}
          {/* TAB: ITEMS */}
          {activeTab === "items" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
                  <h4 className="font-semibold text-gray-800 dark:text-white flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Danh sách sản phẩm
                  </h4>
                </div>

                {formData.items.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center">
                    <ShoppingBag
                      className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600"
                      strokeWidth={1.5}
                    />
                    <p>Chưa có sản phẩm nào trong đơn hàng.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-semibold">
                        <tr>
                          <th className="p-3 w-10 text-center">#</th>
                          <th className="p-3">Tên sản phẩm</th>
                          <th className="p-3 w-32 text-right">Đơn giá</th>
                          <th className="p-3 w-20 text-center">SL</th>
                          <th className="p-3 w-32 text-right">Thành tiền</th>
                          <th className="p-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {formData.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                          >
                            <td className="p-3 text-center text-gray-400">
                              {index + 1}
                            </td>

                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {item.nameSnapshot || "Sản phẩm chưa đặt tên"}
                                </span>
               
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {item.variantId
                                    ? `Variant ID: ${item.variantId}`
                                    : "Sản phẩm thủ công"}
                                </span>
                              </div>
                            </td>

                            {/* Giá:*/}
                            <td className="p-3 text-right">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {formatCurrency(item.price)}
                              </span>
                            </td>

                            {/* Số lượng:  */}
                            <td className="p-3">
                              <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={(e) =>
                                  updateItem(index, "quantity", e.target.value)
                                }
                                disabled
                                className="w-full text-center bg-transparent border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              />
                            </td>

                            <td className="p-3 text-right font-medium text-blue-600 dark:text-blue-400">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
{/* 
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Xóa dòng này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Summary Section */}
              <div className="flex justify-end">
                <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm space-y-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Tạm tính:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Truck className="w-3 h-3 mr-1" /> Phí vận chuyển:
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="w-24 text-right border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent py-0.5 dark:text-white dark:border-gray-600"
                      value={formData.shippingFee}
                      disabled
                      onChange={(e) =>
                        handleInputChange("shippingFee", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Giảm giá:
                    </span>
                    <div className="flex items-center text-red-500">
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        className="w-24 text-right border-b border-red-200 focus:border-red-500 outline-none bg-transparent py-0.5 text-red-600"
                        value={formData.discount}
                        disabled
                        onChange={(e) =>
                          handleInputChange("discount", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="pt-3 border-t dark:border-gray-700 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Tổng cộng:
                    </span>
                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT & STATUS */}
          {activeTab === "payment" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border dark:border-gray-700 shadow-sm md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Trạng thái đơn hàng
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium uppercase text-gray-500 mb-2">
                      Trạng thái xử lý
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="pending">⏳ Chờ xử lý</option>
                      <option value="processing">⚙️ Đang xử lý</option>
                      <option value="completed">✅ Hoàn thành</option>
                      <option value="cancelled">❌ Đã hủy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-gray-500 mb-2">
                      Thanh toán
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) =>
                        handleInputChange("paymentStatus", e.target.value)
                      }
                      className={`w-full border rounded-lg p-2.5 bg-white focus:ring-2 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        formData.paymentStatus === "paid"
                          ? "border-green-300 ring-green-100"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="pending">Chưa thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="failed">Thất bại/Hoàn tiền</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-gray-500 mb-2">
                      Vận chuyển
                    </label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.shippingStatus}
                        onChange={(e) =>
                          handleInputChange("shippingStatus", e.target.value)
                        }
                        className="w-full pl-9 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="VD: Đang giao hàng..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" />
                Lưu đơn hàng
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
