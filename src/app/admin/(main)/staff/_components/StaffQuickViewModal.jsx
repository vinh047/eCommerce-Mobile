"use client";

import { X, Mail, Calendar, Shield, User } from "lucide-react";
import { PERMISSION_KEYS } from "../../constants/permissions";
import PermissionGate from "../../../_components/PermissionGate";

export default function StaffQuickViewModal({ staff, onClose, onEdit }) {
  if (!staff) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold flex items-center">
                <User className="w-5 h-5 mr-2" /> Hồ sơ nhân viên
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-6 flex items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/50">
                {staff.name?.charAt(0) || "S"}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold">{staff.name}</h3>
                <p className="text-blue-100 text-sm">ID: #{staff.id}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {staff.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ngày tham gia
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(staff.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="flex items-center font-semibold mb-3 text-gray-900 dark:text-white">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" /> Vai trò &
                  Quyền hạn
                </h4>
                <div className="flex flex-wrap gap-2">
                  {staff.staffRoles?.length > 0 ? (
                    staff.staffRoles.map((sr) => (
                      <span
                        key={sr.roleId}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                      >
                        {sr.role?.name || `Role ${sr.roleId}`}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">
                      Chưa được gán vai trò nào.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_STAFF}>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={onEdit}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow"
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
}
