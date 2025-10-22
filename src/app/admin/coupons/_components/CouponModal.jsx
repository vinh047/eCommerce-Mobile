"use client";

import { useState } from "react";
import {
  X,
  Tag,
  Shield,
  Calendar,
  DollarSign,
  Percent,
  ClipboardList,
  Info,
  List,
  Shapes,
} from "lucide-react";

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "blocked", label: "Đã khóa" },
  { value: "deleted", label: "Đã xóa" },
];

const typeOptions = [
  { value: "fixed", label: "Giảm cố định (VND)" },
  { value: "percentage", label: "Giảm phần trăm (%)" },
];

export default function CouponModal({ mode, coupon, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Info
    code: coupon?.code || "",
    type: coupon?.type || "fixed",
    value: coupon?.value || 0,
    minOrder: coupon?.minOrder || 0,

    // Time & Usage
    startsAt: coupon?.startsAt
      ? new Date(coupon.startsAt).toISOString().substring(0, 16)
      : "",
    endsAt: coupon?.endsAt
      ? new Date(coupon.endsAt).toISOString().substring(0, 16)
      : "",
    usageLimit: coupon?.usageLimit || null,
    used: coupon?.used || 0, // Chỉ hiển thị/không cho sửa

    // Status & Relationship
    status: coupon?.status || "active",
    categoryId: coupon?.categoryId || null,
    brandId: coupon?.brandId || null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      value: parseFloat(formData.value),
      minOrder: parseFloat(formData.minOrder),
      usageLimit:
        formData.usageLimit !== null && formData.usageLimit !== ""
          ? parseInt(formData.usageLimit)
          : null,
      startsAt: formData.startsAt || null,
      endsAt: formData.endsAt || null,
      categoryId: formData.categoryId || null,
      brandId: formData.brandId || null,
    };

    // Xóa trường used khỏi payload nếu không muốn gửi lên
    delete payload.used;

    console.log("Submitting form data:", payload);
    onSave(payload);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tabs = [
    { id: "basic", name: "Thông tin cơ bản", icon: Tag },
    { id: "rules", name: "Quy tắc & Giới hạn", icon: ClipboardList },
    { id: "targets", name: "Đối tượng áp dụng", icon: List },
  ];

  const ModalTitle =
    mode === "create"
      ? "Tạo mã giảm giá mới"
      : `Chỉnh sửa mã giảm giá: ${coupon?.code || coupon?.id}`;

  const renderBasicTab = () => (
    <div className="space-y-6">
      {/* Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mã Coupon (Code) *
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => handleInputChange("code", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white uppercase"
          placeholder="VD: FREESHIP2024"
          required
          disabled={mode !== "create"}
        />
        {mode !== "create" && (
          <p className="mt-1 text-xs text-gray-500">
            Mã code không thể thay đổi sau khi tạo.
          </p>
        )}
      </div>

      {/* Type and Value */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Loại giảm giá *
          </label>
          <select
            value={formData.type}
            onChange={(e) => {
              handleInputChange("type", e.target.value);
              // Reset value về 0 khi đổi loại
              handleInputChange("value", 0);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white cursor-pointer"
            required
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Giá trị giảm *
          </label>
          <input
            type="number"
            step={formData.type === "percentage" ? "0.01" : "1"}
            min={0}
            max={formData.type === "percentage" ? 100 : undefined}
            value={formData.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            placeholder={formData.type === "percentage" ? "0 - 100" : "VND"}
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.type === "percentage"
              ? "Phần trăm giảm (0-100)"
              : "Số tiền giảm cố định (VND)"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderRulesTab = () => (
    <div className="space-y-6">
      <h4 className="text-md font-semibold dark:text-white">
        Điều kiện áp dụng
      </h4>

      {/* Min Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Đơn hàng tối thiểu (VND)
        </label>
        <input
          type="number"
          step="1000"
          min={0}
          value={formData.minOrder}
          onChange={(e) => handleInputChange("minOrder", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="0.00"
        />
      </div>

      <h4 className="text-md font-semibold dark:text-white pt-4">
        Thời gian & Giới hạn
      </h4>

      {/* Starts At & Ends At */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-blue-500" /> Bắt đầu từ
          </label>
          <input
            type="datetime-local"
            value={formData.startsAt}
            onChange={(e) => handleInputChange("startsAt", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kết thúc vào
          </label>
          <input
            type="datetime-local"
            value={formData.endsAt}
            onChange={(e) => handleInputChange("endsAt", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Usage Limit & Status */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Giới hạn sử dụng (Tổng số lần)
          </label>
          <input
            type="number"
            step="1"
            min={1}
            value={formData.usageLimit || ""}
            onChange={(e) => handleInputChange("usageLimit", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Để trống cho không giới hạn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Trạng thái *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white cursor-pointer"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {mode === "edit" && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Đã sử dụng: {coupon?.used || 0} lần
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderTargetsTab = () => (
    <div className="space-y-4">
      <h4 className="text-md font-semibold dark:text-white">Áp dụng cho</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Để trống cả hai trường nếu áp dụng cho **Tất cả** sản phẩm/thương hiệu.
      </p>

      {/* Category ID */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Shapes className="w-4 h-4 mr-1 text-blue-500" /> ID Danh mục
          (Category ID)
        </label>
        <input
          type="number"
          step="1"
          min={1}
          value={formData.categoryId || ""}
          onChange={(e) => handleInputChange("categoryId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="ID Danh mục cụ thể (tùy chọn)"
        />
      </div>

      {/* Brand ID */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Tag className="w-4 h-4 mr-1 text-blue-500" /> ID Thương hiệu (Brand
          ID)
        </label>
        <input
          type="number"
          step="1"
          min={1}
          value={formData.brandId || ""}
          onChange={(e) => handleInputChange("brandId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="ID Thương hiệu cụ thể (tùy chọn)"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClick}
        ></div>

        {/* Modal */}
        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-4xl w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {ModalTitle}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 max-h-96 overflow-y-auto">
              {activeTab === "basic" && renderBasicTab()}
              {activeTab === "rules" && renderRulesTab()}
              {activeTab === "targets" && renderTargetsTab()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
              >
                {mode === "create" ? "Tạo mã giảm giá" : "Cập nhật mã giảm giá"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
