"use client";

import { useState } from "react";
import { X, Star, User, Package, Image as ImageIcon } from "lucide-react";

export default function ReviewsModal({ review, onClose, onSave }) {
  const [formData, setFormData] = useState({
    content: review?.content || "",
    isActived: review?.isActived ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const photos = Array.isArray(review?.photosJson) ? review.photosJson : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Kiểm duyệt Đánh giá #{review.id}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[80vh] overflow-y-auto">
            {/* Info Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                     <User className="w-4 h-4 mr-2" /> Người đánh giá
                  </div>
                  <p className="font-medium dark:text-white">{review.user?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{review.user?.email}</p>
               </div>
               <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                     <Package className="w-4 h-4 mr-2" /> Sản phẩm
                  </div>
                  <p className="font-medium dark:text-white">{review.product?.name || "Unknown Product"}</p>
               </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
               <label className="block text-sm font-medium mb-2 dark:text-gray-300">Mức độ hài lòng</label>
               <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-6 h-6 ${i < review.stars ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">({review.stars}/5 sao)</span>
               </div>
            </div>

            {/* Content Edit */}
            <div className="mb-6">
               <label className="block text-sm font-medium mb-2 dark:text-gray-300">Nội dung đánh giá</label>
               <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border rounded-lg p-3 min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Nội dung..."
               />
               <p className="text-xs text-gray-500 mt-1">Admin có thể chỉnh sửa nội dung nếu chứa từ ngữ không phù hợp.</p>
            </div>

            {/* Photos */}
            {photos.length > 0 && (
               <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300 items-center">
                     <ImageIcon className="w-4 h-4 mr-2" /> Hình ảnh đính kèm
                  </label>
                  <div className="flex flex-wrap gap-3">
                     {photos.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border dark:border-gray-600 group">
                           <img src={url} alt="Review" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Status Switch */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
               <div>
                  <span className="font-medium dark:text-white">Hiển thị đánh giá này</span>
                  <p className="text-xs text-gray-500">Nếu tắt, đánh giá sẽ bị ẩn khỏi trang sản phẩm.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                     type="checkbox" 
                     className="sr-only peer"
                     checked={formData.isActived}
                     onChange={(e) => setFormData({...formData, isActived: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
               </label>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
               <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">Đóng</button>
               <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}