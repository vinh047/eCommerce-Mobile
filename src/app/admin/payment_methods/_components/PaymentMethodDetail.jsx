"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Trash2,
  LayoutList,
  Building2,
  Plus,
  PenSquare,
} from "lucide-react";
import AccountModal from "./AccountModal";
import PermissionGate from "../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function PaymentMethodDetail({
  isCreating,
  method,
  onSaveMethod,
  onDeleteMethod,
  onSaveAccount,
  onDeleteAccount,
}) {
  const [activeTab, setActiveTab] = useState("info");

  // Form Data cho PaymentMethod (Cha)
  const [formData, setFormData] = useState({
    name: method?.name || "",
    code: method?.code || "",
    description: method?.description || "",
    logoUrl: method?.logoUrl || "",
    isActive: method?.isActive ?? true,
    displayOrder: method?.displayOrder || 0,
  });

  useEffect(() => {
    setFormData({
      name: method?.name || "",
      code: method?.code || "",
      description: method?.description || "",
      logoUrl: method?.logoUrl || "",
      isActive: method?.isActive ?? true,
      displayOrder: method?.displayOrder || 0,
    });
  }, [method]);

  // Modal Account State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  // --- Handlers ---

  const handleSubmitInfo = () => {
    onSaveMethod(formData);
  };

  // Modal Handlers
  const handleOpenCreateAccount = () => {
    setEditingAccount(null);
    setShowAccountModal(true);
  };

  const handleOpenEditAccount = (acc) => {
    setEditingAccount(acc);
    setShowAccountModal(true);
  };

  const handleSaveAccountWrapper = async (data) => {
    await onSaveAccount(data, method.id, editingAccount?.id);
    setShowAccountModal(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-t-lg">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {isCreating ? "Tạo phương thức mới" : `Chi tiết: ${method?.name}`}
        </h2>
        <div className="flex space-x-2">
          <PermissionGate permission={PERMISSION_KEYS.DELETE_PAYMENT_METHOD}>
            {!isCreating && (
              <button
                onClick={onDeleteMethod}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </PermissionGate>
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_PAYMENT_METHOD}>
            <button
              onClick={handleSubmitInfo}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? "Tạo mới" : "Lưu thay đổi"}
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6">
        <nav className="flex space-x-6 -mb-px">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-4 text-sm font-medium border-b-2 flex items-center transition-colors ${
              activeTab === "info"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <LayoutList className="w-4 h-4 mr-2" /> Thông tin chung
          </button>
          {!isCreating && (
            <button
              onClick={() => setActiveTab("accounts")}
              className={`py-4 text-sm font-medium border-b-2 flex items-center transition-colors ${
                activeTab === "accounts"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              <Building2 className="w-4 h-4 mr-2" /> Tài khoản nhận tiền (
              {method?.accounts?.length || 0})
            </button>
          )}
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === "info" ? (
          // --- TAB 1: INFO ---
          <div className="grid grid-cols-2 gap-5 max-w-3xl">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên hiển thị
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Chuyển khoản ngân hàng"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mã định danh (Code)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={!isCreating}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 ${
                  !isCreating ? "opacity-70 cursor-not-allowed" : ""
                }`}
                placeholder="bank_transfer"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả / Hướng dẫn
              </label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Hướng dẫn ngắn cho người dùng..."
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo URL
              </label>
              <input
                type="text"
                value={formData.logoUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, logoUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thứ tự hiển thị (Method)
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  Kích hoạt phương thức này
                </span>
              </label>
            </div>
          </div>
        ) : (
          // --- TAB 2: ACCOUNTS (Normal Table) ---
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase text-gray-500">
                Danh sách tài khoản
              </h3>
              <PermissionGate
                permission={PERMISSION_KEYS.CREATE_PAYMENT_ACCOUNT}
              >
                <button
                  onClick={handleOpenCreateAccount}
                  className="text-xs flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" /> Thêm tài khoản
                </button>
              </PermissionGate>
            </div>

            {method?.accounts?.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ngân hàng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Số tài khoản
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <PermissionGate
                        permission={
                          (PERMISSION_KEYS.UPDATE_PAYMENT_ACCOUNT,
                          PERMISSION_KEYS.DELETE_PAYMENT_ACCOUNT)
                        }
                      >
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </PermissionGate>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {method.accounts.map((acc) => (
                      <tr
                        key={acc.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {acc.bankName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {acc.accountName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-300">
                          {acc.accountNumber}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {acc.isActive ? (
                            <span
                              className="inline-block w-2 h-2 rounded-full bg-green-500"
                              title="Đang hoạt động"
                            ></span>
                          ) : (
                            <span
                              className="inline-block w-2 h-2 rounded-full bg-red-400"
                              title="Đã tắt"
                            ></span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <PermissionGate
                            permission={PERMISSION_KEYS.UPDATE_PAYMENT_ACCOUNT}
                          >
                            <button
                              onClick={() => handleOpenEditAccount(acc)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <PenSquare className="w-4 h-4" />
                            </button>
                          </PermissionGate>
                          <PermissionGate
                            permission={PERMISSION_KEYS.DELETE_PAYMENT_ACCOUNT}
                          >
                            <button
                              onClick={() => onDeleteAccount(acc.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </PermissionGate>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-center py-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                Chưa có tài khoản nào. Nhấn "Thêm tài khoản" để tạo mới.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal
          account={editingAccount}
          onClose={() => setShowAccountModal(false)}
          onSave={handleSaveAccountWrapper}
        />
      )}
    </div>
  );
}
