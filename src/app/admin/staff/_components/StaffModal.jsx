"use client";

import { useState, useEffect } from "react";
import { X, User, Shield, Key, Mail, Lock, Check } from "lucide-react";
import rolesApi from "@/lib/api/rolesApi"; // Import API role để lấy list

export default function StaffModal({ mode, staff, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("info");
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  const [formData, setFormData] = useState({
    name: staff?.name || "",
    email: staff?.email || "",
    password: "",
    confirmPassword: "",
    status: staff?.status || "active",
    avatar: staff?.avatar || "",
    // Map staffRoles -> array of roleId
    roleIds: staff?.staffRoles?.map((sr) => sr.roleId) || [],
  });

  // Fetch Roles khi mở modal
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await rolesApi.getRoles({ pageSize: 100 }); // Lấy tất cả role
        setAvailableRoles(res.data || []);
      } catch (error) {
        console.error("Failed to load roles", error);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (roleId) => {
    setFormData((prev) => {
      const current = prev.roleIds;
      if (current.includes(roleId)) {
        return { ...prev, roleIds: current.filter((id) => id !== roleId) };
      } else {
        return { ...prev, roleIds: [...current, roleId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      activeTab === "security" &&
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Chuẩn bị payload
    const payload = {
      name: formData.name,
      email: formData.email,
      status: formData.status,
      avatar: formData.avatar,
      roleIds: formData.roleIds, // Quan trọng: Gửi mảng roleId lên
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    onSave(payload);
  };

  const tabs = [
    { id: "info", name: "Thông tin cơ bản", icon: User },
    { id: "security", name: "Bảo mật & Quyền hạn", icon: Shield },
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
                ? "Thêm nhân viên mới"
                : `Chỉnh sửa: ${staff.name}`}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
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
                  className={`flex-1 py-4 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email đăng nhập *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        disabled={mode === "edit"}
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        placeholder="staff@example.com"
                      />
                    </div>
                    {mode === "edit" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Email không thể thay đổi.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Link Avatar
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) =>
                        handleInputChange("avatar", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB SECURITY & ROLES */}
            {activeTab === "security" && (
              <div className="space-y-8">
                {/* Password Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
                    <Lock className="w-4 h-4 mr-2" /> Thiết lập mật khẩu
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mật khẩu{" "}
                        {mode === "create" ? "*" : "(Để trống nếu không đổi)"}
                      </label>
                      <input
                        type="password"
                        required={mode === "create"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        required={mode === "create"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <hr className="dark:border-gray-700" />

                {/* Status & Roles Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Status */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                      Trạng thái
                    </h4>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="blocked">Đã khóa</option>
                      <option value="inactive">Ngừng hoạt động</option>
                    </select>
                  </div>

                  {/* Roles Selection */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                      Vai trò đảm nhiệm
                      {loadingRoles && (
                        <span className="text-xs font-normal text-blue-500">
                          Đang tải...
                        </span>
                      )}
                    </h4>

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-h-40 overflow-y-auto p-1">
                      {availableRoles.length === 0 && !loadingRoles && (
                        <div className="text-center py-4 text-sm text-gray-500">
                          Chưa có vai trò nào được tạo.
                        </div>
                      )}

                      {availableRoles.map((role) => {
                        const isSelected = formData.roleIds.includes(role.id);
                        return (
                          <div
                            key={role.id}
                            onClick={() => toggleRole(role.id)}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-900/30"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {role.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500">
                      Nhân viên có thể đảm nhận nhiều vai trò cùng lúc.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer inside Form to align with scroll if needed, or keep sticky */}
            <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium"
              >
                {mode === "create" ? "Tạo nhân viên" : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
