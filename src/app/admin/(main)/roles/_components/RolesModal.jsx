"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Shield, CheckSquare } from "lucide-react";
import { groupPermissions } from "../utils/permissionGroups";

export default function RolesModal({
  mode,
  role,
  onClose,
  onSave,
  permissions,
}) {
  // State để điều khiển Animation xuất hiện
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: role?.name || "",
    permissionIds: role?.rolePermissions?.map((rp) => rp.permissionId) || [],
  });

  const groupedPerms = useMemo(
    () => groupPermissions(permissions),
    [permissions]
  );

  // Trigger animation khi component mount
  useEffect(() => {
    setIsVisible(true);
    // Cleanup khi unmount (nếu cần xử lý phức tạp hơn)
    return () => setIsVisible(false);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (id) => {
    setFormData((prev) => {
      const currentIds = prev.permissionIds;
      if (currentIds.includes(id)) {
        return {
          ...prev,
          permissionIds: currentIds.filter((pid) => pid !== id),
        };
      } else {
        return { ...prev, permissionIds: [...currentIds, id] };
      }
    });
  };

  const toggleGroup = (groupItems) => {
    const groupIds = groupItems.map((i) => i.id);
    const allSelected = groupIds.every((id) =>
      formData.permissionIds.includes(id)
    );

    setFormData((prev) => {
      let newIds = [...prev.permissionIds];
      if (allSelected) {
        newIds = newIds.filter((id) => !groupIds.includes(id));
      } else {
        const toAdd = groupIds.filter((id) => !newIds.includes(id));
        newIds = [...newIds, ...toAdd];
      }
      return { ...prev, permissionIds: newIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Hàm xử lý đóng modal với animation ngược (nếu muốn), ở đây ta đóng ngay
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Đợi animation đóng chạy xong mới unmount (optional)
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Container căn giữa */}
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Backdrop (Nền đen mờ) - Có hiệu ứng Fade */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        ></div>

        {/* Modal Content - Có hiệu ứng Scale & Fade (Pop up) */}
        <div
          className={`relative z-10 bg-white dark:bg-gray-800 rounded-xl text-left shadow-2xl transform transition-all duration-300 ease-out flex flex-col w-full sm:max-w-5xl h-[85vh] ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0 bg-gray-50/50 dark:bg-gray-800 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {mode === "create"
                  ? "Thêm mới Vai trò"
                  : `Cập nhật: ${role?.name}`}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Scrollable */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tên Vai trò <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white transition-shadow shadow-sm placeholder-gray-400"
                  placeholder="Nhập tên vai trò (VD: Quản lý kho, Editor...)"
                  autoFocus
                  required
                />
              </div>

              {/* Divider */}
              <div className="relative mb-8">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="pr-3 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Phân quyền chức năng ({formData.permissionIds.length} đã
                    chọn)
                  </span>
                </div>
              </div>

              {/* PHẦN 2: DANH SÁCH QUYỀN (GRID) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(groupedPerms).map(([key, group]) => {
                  const groupIds = group.items.map((i) => i.id);
                  const isGroupFull = groupIds.every((id) =>
                    formData.permissionIds.includes(id)
                  );
                  const hasSome = groupIds.some((id) =>
                    formData.permissionIds.includes(id)
                  );

                  return (
                    <div
                      key={key}
                      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                        hasSome
                          ? "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                    >
                      {/* Group Header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white/50 dark:bg-gray-800/50">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">
                          {group.label}
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.items)}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                        >
                          {isGroupFull ? "Bỏ chọn hết" : "Chọn tất cả"}
                        </button>
                      </div>

                      {/* Permission Items */}
                      <div className="p-3 space-y-2">
                        {group.items.map((perm) => {
                          const isChecked = formData.permissionIds.includes(
                            perm.id
                          );
                          return (
                            <label
                              key={perm.id}
                              className={`flex items-start p-2 rounded-lg cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-blue-100/50 dark:bg-blue-900/30"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              }`}
                            >
                              <div className="flex items-center h-5 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.id)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                              <div className="ml-3">
                                <span
                                  className={`text-sm font-medium block ${
                                    isChecked
                                      ? "text-blue-900 dark:text-blue-100"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {perm.name}
                                </span>
                                {perm.description && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                                    {perm.description}
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl flex-shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                {mode === "create" ? "Tạo Vai trò" : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
