"use client";

import {
  X,
  Copy,
  Edit,
  Star,
  StarHalf,
  StarOff,
  Smartphone,
} from "lucide-react";

const productImageClasses = [
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-pink-400 to-red-500",
  "bg-gradient-to-br from-blue-400 to-cyan-500",
  "bg-gradient-to-br from-pink-500 to-yellow-400",
  "bg-gradient-to-br from-teal-300 to-pink-300",
];

export default function QuickViewModal({
  product,
  onClose,
  onEdit,
  onDuplicate,
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getImageClass = (productId) => {
    const index = parseInt(productId.slice(-1)) || 0;
    return productImageClasses[index % productImageClasses.length];
  };

  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++)
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400" />
      );
    if (hasHalfStar)
      stars.push(<StarHalf key="half" className="w-4 h-4 text-yellow-400" />);
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++)
      stars.push(
        <StarOff key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
      );

    return stars;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Slide Panel */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chi tiết sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Product Image & Info */}
          <div className="flex items-start space-x-6">
            <div
              className={`w-28 h-28 ${getImageClass(
                product.id
              )} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
            >
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>ID: {product.id}</span>
                <span>
                  SKU: {product.sku || product.id.replace("PRD", "SKU")}
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.brand}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    product.isActive
                      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {product.isActive ? "Đang hiển thị" : "Đã ẩn"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Danh mục
              </h4>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-sm">
                {product.category}
              </span>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đánh giá
              </h4>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.rating}
                </div>
                <div className="flex items-center space-x-1">
                  {generateStars(product.rating)}
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
            </div>

            {/* Date */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày tạo
              </h4>
              <p className="text-gray-900 dark:text-white">
                {formatDate(product.createdAt)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mô tả
                </h4>
                <p className="text-gray-800 dark:text-gray-200">
                  {product.description}
                </p>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Đánh giá gần đây
              </h4>
              <div className="space-y-4">
                {[
                  {
                    name: "Nguyễn Văn A",
                    date: "15/11/2024",
                    text: "Sản phẩm rất tốt, chất lượng như mong đợi. Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop!",
                    rating: 5,
                    bg: "bg-blue-600",
                  },
                  {
                    name: "Trần Thị B",
                    date: "14/11/2024",
                    text: "Máy đẹp, chạy mượt. Tuy nhiên giá hơi cao so với thị trường. Nhìn chung vẫn hài lòng với sản phẩm.",
                    rating: 4,
                    bg: "bg-green-600",
                  },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`${review.bg} w-10 h-10 rounded-full flex items-center justify-center text-white font-medium`}
                        >
                          {review.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {review.name}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                              {[...Array(review.rating)].map((_, idx) => (
                                <Star key={idx} className="w-3 h-3" />
                              ))}
                              {[...Array(5 - review.rating)].map((_, idx) => (
                                <StarOff key={idx} className="w-3 h-3" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Trả lời
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Ẩn
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-end gap-3">
          <button
            onClick={onDuplicate}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition"
          >
            <Copy className="w-4 h-4" /> Nhân bản
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition"
          >
            <Edit className="w-4 h-4" /> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
