import { Star } from "lucide-react";

export default function RecentReviews({ reviews = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đánh giá mới nhất</h3>
      </div>
      <div className="p-6 space-y-4">
        {reviews.length === 0 && <p className="text-gray-500 text-center text-sm">Chưa có đánh giá nào.</p>}
        {reviews.map((review) => (
          <div key={review.id} className="flex space-x-3">
            <div className="flex-shrink-0">
               {review.user?.avatar ? (
                   <img src={review.user.avatar} alt="Avt" className="w-8 h-8 rounded-full object-cover"/>
               ) : (
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                       {review.user?.name?.charAt(0)}
                   </div>
               )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{review.user?.name}</span>
                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex text-yellow-400 my-1">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.stars ? "fill-current" : "text-gray-300 dark:text-gray-600"} />
                 ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">Sản phẩm: {review.product?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}