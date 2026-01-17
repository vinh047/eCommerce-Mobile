"use client";

import { X, Star, User, MessageSquare } from "lucide-react";
import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function ReviewsQuickViewModal({ review, onClose, onEdit }) {
  if (!review) return null;

  const photos = Array.isArray(review.photosJson) ? review.photosJson : [];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col">
        <div className="p-6 bg-yellow-500 text-white">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" /> Đánh giá #{review.id}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.stars
                      ? "fill-white text-white"
                      : "text-yellow-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-yellow-100 text-sm mt-1">
              Ngày: {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {review.user?.name}
              </p>
              <p className="text-xs text-gray-500">
                về sản phẩm{" "}
                <span className="font-semibold text-blue-600">
                  {review.product?.name}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 dark:text-white">Nội dung:</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
              {review.content || "Không có nội dung"}
            </p>
          </div>

          {photos.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 dark:text-white">
                Hình ảnh ({photos.length}):
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="review-img"
                    className="w-full h-24 object-cover rounded-lg border dark:border-gray-600"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <PermissionGate permission={PERMISSION_KEYS.UPDATE_REVIEW}>
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={onEdit}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
            >
              Kiểm duyệt / Chỉnh sửa
            </button>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
