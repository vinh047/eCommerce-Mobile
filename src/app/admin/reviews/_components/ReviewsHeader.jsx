"use client";

export default function ReviewsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Đánh giá
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kiểm duyệt ý kiến khách hàng về sản phẩm.
        </p>
      </div>
      {/* Thường admin không tạo review, nên chỉ cần nút Export nếu muốn */}
    </div>
  );
}