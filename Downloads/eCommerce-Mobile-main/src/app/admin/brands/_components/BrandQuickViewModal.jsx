"use client";

import { X, Tag, Link as LinkIcon, Calendar, Box, Ticket } from "lucide-react";

export default function BrandQuickViewModal({ brand, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-blue-500" /> Chi tiết Thương hiệu
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
              {brand.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{brand.name}</h3>
            <p className="text-sm text-blue-500 mt-1">/{brand.slug}</p>
            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${brand.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {brand.isActive ? "Đang hoạt động" : "Đã ẩn"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <Box className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{brand._count?.products || 0}</div>
                <div className="text-xs text-gray-500">Sản phẩm</div>
             </div>
             <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <Ticket className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{brand._count?.coupons || 0}</div>
                <div className="text-xs text-gray-500">Mã giảm giá</div>
             </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 text-sm flex items-center"><Calendar className="w-4 h-4 mr-2"/> Ngày tạo</span>
                <span className="text-gray-900 dark:text-white text-sm">{new Date(brand.createdAt).toLocaleDateString("vi-VN")}</span>
             </div>
             <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 text-sm">ID Hệ thống</span>
                <span className="font-mono text-gray-900 dark:text-white text-sm">#{brand.id}</span>
             </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white dark:bg-gray-800">
          <button onClick={onEdit} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
}