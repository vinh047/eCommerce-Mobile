"use client";

import { useState } from "react";
import {
  X,
  ShoppingBag,
  CreditCard,
  User,
  Truck,
  Plus,
  Trash2,
} from "lucide-react";

export default function OrdersModal({ mode, order, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("info");

  // State form data
  const [formData, setFormData] = useState({
    code: order?.code || "", // Thường tự sinh, nhưng để edit nếu cần
    userId: order?.userId || "",
    status: order?.status || "pending",
    paymentStatus: order?.paymentStatus || "pending",
    shippingStatus: order?.shippingStatus || "pending",
    note: order?.note || "",
    // Items - Mockup structure
    items: order?.items || [],
    discount: order?.discount || 0,
    shippingFee: order?.shippingFee || 0,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Logic thêm sản phẩm tạm thời (trong thực tế cần Product Selector)
  const addItem = () => {
    const newItem = {
      id: Date.now(), // Temp ID
      variantId: 0,
      nameSnapshot: "Sản phẩm mới",
      price: 0,
      quantity: 1,
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // Tính toán Total
  const subtotal = formData.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const total =
    subtotal + Number(formData.shippingFee) - Number(formData.discount);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, total, subtotal });
  };

  const tabs = [
    { id: "info", name: "Thông tin chung", icon: User },
    { id: "items", name: "Sản phẩm", icon: ShoppingBag },
    { id: "payment", name: "Thanh toán & Giao vận", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-4xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === "create"
                ? "Tạo đơn hàng mới"
                : `Cập nhật đơn: ${order.code}`}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 max-h-[70vh] overflow-y-auto"
          >
            {/* TAB INFO */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    User ID (Khách hàng)
                  </label>
                  <input
                    type="number"
                    value={formData.userId}
                    onChange={(e) =>
                      handleInputChange("userId", e.target.value)
                    }
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập ID khách hàng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* TAB ITEMS */}
            {activeTab === "items" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold dark:text-white">
                    Danh sách sản phẩm
                  </h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm dòng
                  </button>
                </div>

                <div className="border rounded dark:border-gray-700 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="p-2 dark:text-gray-300">
                          Tên SP (Snapshot)
                        </th>
                        <th className="p-2 w-24 dark:text-gray-300">Giá</th>
                        <th className="p-2 w-20 dark:text-gray-300">SL</th>
                        <th className="p-2 w-24 dark:text-gray-300">
                          Thành tiền
                        </th>
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.nameSnapshot}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "nameSnapshot",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                updateItem(index, "price", e.target.value)
                              }
                              className="w-full border rounded px-2 py-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(index, "quantity", e.target.value)
                              }
                              className="w-full border rounded px-2 py-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </td>
                          <td className="p-2 font-medium dark:text-gray-300">
                            {(item.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end space-y-1 flex-col items-end text-sm">
                  <div className="flex justify-between w-48">
                    <span className="text-gray-500">Tạm tính:</span>
                    <span className="font-medium dark:text-white">
                      {subtotal.toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex justify-between w-48 items-center">
                    <span className="text-gray-500">Phí ship:</span>
                    <input
                      type="number"
                      className="w-20 border rounded px-1 text-right dark:bg-gray-700 dark:text-white"
                      value={formData.shippingFee}
                      onChange={(e) =>
                        handleInputChange("shippingFee", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-between w-48 items-center">
                    <span className="text-gray-500">Giảm giá:</span>
                    <input
                      type="number"
                      className="w-20 border rounded px-1 text-right dark:bg-gray-700 dark:text-white"
                      value={formData.discount}
                      onChange={(e) =>
                        handleInputChange("discount", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-between w-48 border-t pt-2 mt-1">
                    <span className="font-bold text-lg dark:text-white">
                      Tổng cộng:
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      {total.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB PAYMENT & SHIPPING */}
            {activeTab === "payment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Trạng thái Đơn hàng
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Trạng thái Thanh toán
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      handleInputChange("paymentStatus", e.target.value)
                    }
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Trạng thái Vận chuyển
                  </label>
                  <input
                    type="text"
                    value={formData.shippingStatus}
                    onChange={(e) =>
                      handleInputChange("shippingStatus", e.target.value)
                    }
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="VD: Đang giao, Đã lấy hàng..."
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
