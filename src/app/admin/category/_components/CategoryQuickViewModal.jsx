"use client";

import {
  X,
  Folder,
  Link as LinkIcon,
  Calendar,
  Box,
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function CategoryQuickViewModal({ category, onClose, onEdit }) {
  // Render Icon động
  const renderDynamicIcon = (iconKey) => {
    if (!iconKey) return null;
    const IconComponent = LucideIcons[iconKey];
    return IconComponent ? (
      <IconComponent className="w-8 h-8 text-white" />
    ) : (
      <span className="text-white font-bold text-xl">{iconKey.charAt(0)}</span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Folder className="w-5 h-5 mr-2 text-blue-500" /> Chi tiết Danh mục
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              {category.iconKey ? (
                renderDynamicIcon(category.iconKey)
              ) : (
                <Folder className="w-10 h-10 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h3>
            <p className="text-sm text-blue-500 mt-1 flex items-center justify-center gap-1">
              <LinkIcon className="w-3 h-3" /> /{category.slug}
            </p>
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  category.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {category.isActive ? "Đang hoạt động" : "Đã ẩn"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center border border-blue-100 dark:border-blue-800">
              <Box className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {category._count?.products || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Sản phẩm
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center border border-purple-100 dark:border-purple-800">
              <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {category._count?.children || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Danh mục con
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <FolderOpen className="w-4 h-4 mr-2" /> Danh mục cha
              </span>
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {category.parent ? (
                  category.parent.name
                ) : (
                  <span className="text-gray-400 italic">-- Gốc --</span>
                )}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" /> Icon Key
              </span>
              <span className="font-mono text-gray-900 dark:text-white text-sm">
                {category.iconKey || "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Ngày tạo
              </span>
              <span className="text-gray-900 dark:text-white text-sm">
                {new Date(category.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ID Hệ thống
              </span>
              <span className="font-mono text-gray-900 dark:text-white text-sm">
                #{category.id}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={onEdit}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
