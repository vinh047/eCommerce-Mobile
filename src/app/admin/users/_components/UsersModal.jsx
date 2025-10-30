"use client";

import { useState } from "react";
import {
  X,
  User, // Thông tin cơ bản
  Shield, // Bảo mật/Mật khẩu
  MapPin, // Địa chỉ
  UserCog, // Vai trò/Trạng thái
  Mail,
  Key,
  Calendar,
  Info,
} from "lucide-react";

// Dữ liệu giả định cho dropdowns
const roleOptions = [
  { value: "customer", label: "Khách hàng" },
  { value: "staff", label: "Nhân viên" },
  { value: "admin", label: "Quản trị viên" },
];

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Đã khóa" },
  { value: "pending", label: "Chờ xác nhận" },
];

export default function UserModal({ mode, user, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Info
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",

    // Security/Status Info (Chỉ định rõ hơn cho User)
    password: "", // Chỉ dùng khi tạo mới hoặc reset
    confirmPassword: "",
    role: user?.role || "customer",
    status: user?.status || "active",

    // Avatar
    avatar: user?.avatar || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Thêm validation cơ bản cho mật khẩu nếu ở tab security
    if (
      activeTab === "security" &&
      formData.password !== formData.confirmPassword
    ) {
      alert("Mật khẩu và Xác nhận mật khẩu không khớp!");
      return;
    }

    onSave(formData);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tabs = [
    { id: "basic", name: "Thông tin cơ bản", icon: User },
    { id: "security", name: "Bảo mật & Trạng thái", icon: Shield },
    { id: "addresses", name: "Địa chỉ", icon: MapPin },
    // Có thể thêm tab Roles/Permissions nếu cần quản lý quyền chi tiết hơn
  ];

  const ModalTitle =
    mode === "create"
      ? "Tạo người dùng mới"
      : `Chỉnh sửa người dùng: ${user?.name || user?.email || user?.id}`;

  const renderBasicTab = () => (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Họ tên *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="Nhập họ tên"
          required
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-1 text-blue-500" /> Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            placeholder="example@email.com"
            required
            disabled={mode !== "create"} // Không cho sửa email khi chỉnh sửa
          />
          {mode !== "create" && (
            <p className="mt-1 text-xs text-gray-500">
              Email không thể thay đổi sau khi tạo.
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            placeholder="0901234567"
          />
        </div>
      </div>

      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          URL Avatar
        </label>
        <input
          type="url"
          value={formData.avatar}
          onChange={(e) => handleInputChange("avatar", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h4 className="text-md font-semibold dark:text-white">
        Cập nhật Mật khẩu
      </h4>

      {mode === "edit" && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <Info className="w-4 h-4 inline mr-1" /> Chỉ nhập mật khẩu nếu bạn
          muốn **thay đổi** mật khẩu hiện tại của người dùng.
        </p>
      )}

      {/* Password & Confirm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Key className="w-4 h-4 mr-1 text-blue-500" /> Mật khẩu{" "}
            {mode === "create" ? "*" : ""}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Nhập mật khẩu"
            required={mode === "create"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Xác nhận Mật khẩu {mode === "create" ? "*" : ""}
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Xác nhận mật khẩu"
            required={mode === "create"}
          />
        </div>
      </div>

      <h4 className="text-md font-semibold dark:text-white pt-4">
        Phân quyền & Trạng thái
      </h4>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Trạng thái tài khoản *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mode === "edit" && (
        <div className="pt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Đã tạo: {new Date(user?.createdAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  const renderAddressesTab = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Phần này thường cần một component con riêng để quản lý danh sách địa
        chỉ. Ví dụ: `AddressListManager`
      </p>

      {/* Giả định: Danh sách địa chỉ (Chỉ là placeholder) */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h5 className="font-semibold dark:text-white mb-2">
          Địa chỉ đang có ({user?.addresses?.length || 0})
        </h5>

        {user?.addresses?.length > 0 ? (
          user.addresses.map((addr, index) => (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-gray-600 py-2"
            >
              <p className="text-sm dark:text-gray-300">
                {addr.line}, {addr.ward}, {addr.district}, {addr.province}
              </p>
              {addr.isDefault && (
                <span className="text-xs text-blue-500 font-medium">
                  {" "}
                  (Mặc định)
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            Người dùng này chưa có địa chỉ nào.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

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
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
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
              {activeTab === "security" && renderSecurityTab()}
              {activeTab === "addresses" && renderAddressesTab()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {mode === "create" ? "Tạo người dùng" : "Cập nhật người dùng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
