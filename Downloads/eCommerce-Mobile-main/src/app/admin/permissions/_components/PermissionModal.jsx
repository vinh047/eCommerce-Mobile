// src/pages/permissions/_components/PermissionModal.jsx
"use client";

import { useState } from "react";
import { X, Key, Shield, Info } from "lucide-react";
import { validatePermission } from "../utils/permissionValidator";
import { toast } from "sonner";

export default function PermissionModal({ mode, permission, onClose, onSave }) {
  const [formData, setFormData] = useState({
    key: permission?.key || "",
    name: permission?.name || "",
    description: permission?.description || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      key: formData.key.trim(),
      name: formData.name.trim(),
    };

    const validationError = validatePermission(payload);
    if (validationError !== null) {
      toast.error(validationError);
      return;
    }

    onSave(payload);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const ModalTitle =
    mode === "create"
      ? "Tạo Quyền hạn mới"
      : `Chỉnh sửa Quyền hạn: ${permission?.key || permission?.id}`;

  const renderContent = () => (
    <div className="space-y-6">
      {/* Key */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Key className="w-4 h-4 mr-2 text-blue-500" />
          Key (Khóa) *
        </label>
        <input
          type="text"
          value={formData.key}
          onChange={(e) => handleInputChange("key", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white font-mono text-sm"
          placeholder="VD: inventory:manage"
          required
          disabled={mode !== "create"} // Key không nên thay đổi sau khi tạo
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Key là định danh duy nhất dùng để kiểm tra quyền trong code (vd:{" "}
          <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            product:create
          </code>
          ).
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-blue-500" />
          Tên hiển thị *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="VD: Quản lý Sản phẩm"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2 text-blue-500" />
          Mô tả (Tùy chọn)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
          placeholder="Mô tả chi tiết về quyền hạn này..."
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
        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
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

          {/* Modal Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {renderContent()}
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
                {mode === "create" ? "Tạo Quyền hạn" : "Cập nhật Quyền hạn"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
