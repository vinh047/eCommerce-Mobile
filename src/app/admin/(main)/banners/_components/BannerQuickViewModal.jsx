"use client";

import { X, Image as ImageIcon, Link, Hash } from "lucide-react";
import { PERMISSION_KEYS } from "../../constants/permissions";
import PermissionGate from "../../_components/PermissionGate";

export default function BannerQuickViewModal({ banner, onClose, onEdit }) {
  if (!banner) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" /> Chi tiết Banner
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-4">
                <span className={`px-2 py-1 bg-white/20 rounded text-xs font-semibold border border-white/30`}>
                    #{banner.id}
                </span>
                 <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${banner.isActive ? 'bg-green-400/80 text-white' : 'bg-gray-400/80 text-white'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Image Preview */}
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <img 
                    src={banner.image} 
                    alt={banner.altText} 
                    className="w-full h-auto object-cover"
                />
            </div>

            <div className="space-y-4">
              <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="min-w-[24px]">
                    <span className="font-bold text-gray-500 text-xs uppercase">Alt Text</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {banner.altText || "Không có mô tả"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Link className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sản phẩm liên kết
                  </p>
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    {banner.product?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Hash className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thứ tự hiển thị
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {banner.displayOrder}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <PermissionGate permission={PERMISSION_KEYS.UPDATE_BANNER}>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={onEdit}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow"
              >
                Chỉnh sửa Banner
              </button>
            </div>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
}