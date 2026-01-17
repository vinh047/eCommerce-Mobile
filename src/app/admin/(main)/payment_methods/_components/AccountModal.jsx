"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function AccountModal({ account, onClose, onSave }) {
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankBranch: "",
    qrCodeUrl: "",
    isActive: true,
  });

  useEffect(() => {
    if (account) {
      setFormData(account);
    }
  }, [account]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {account ? "Cập nhật tài khoản" : "Thêm tài khoản nhận tiền"}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên ngân hàng / Ví</label>
              <input
                required
                type="text"
                value={formData.bankName || ""}
                onChange={(e) => handleChange("bankName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white"
                placeholder="VD: Vietcombank, Momo..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số tài khoản / SĐT</label>
                <input
                  required
                  type="text"
                  value={formData.accountNumber || ""}
                  onChange={(e) => handleChange("accountNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chi nhánh (Option)</label>
                <input
                  type="text"
                  value={formData.bankBranch || ""}
                  onChange={(e) => handleChange("bankBranch", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên chủ tài khoản</label>
              <input
                required
                type="text"
                value={formData.accountName || ""}
                onChange={(e) => handleChange("accountName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white uppercase"
                placeholder="NGUYEN VAN A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link ảnh QR (Option)</label>
              <input
                type="text"
                value={formData.qrCodeUrl || ""}
                onChange={(e) => handleChange("qrCodeUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
               <input
                  type="checkbox"
                  id="accountActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
               />
               <label htmlFor="accountActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đang hoạt động
               </label>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {account ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}