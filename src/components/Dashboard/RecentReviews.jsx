// src/components/Dashboard/RecentReviews.jsx
const recentReviews = [
  {
    name: "Nguyễn Văn D",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23F59E0B'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EN%3C/text%3E%3C/svg%3E",
    rating: 5,
    comment: "iPhone 15 Pro Max rất tuyệt vời, camera chụp đẹp...",
    time: "2 giờ trước",
  },
  {
    name: "Trần Thị E",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2310B981'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3ET%3C/text%3E%3C/svg%3E",
    rating: 4,
    comment: "Samsung Galaxy S24 Ultra pin trâu, hiệu năng mạnh...",
    time: "4 giờ trước",
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <i
          key={i}
          className={`text-xs ${i < rating ? "fas fa-star" : "far fa-star"}`}
        ></i>
      ))}
    </div>
  );
};

export default function RecentReviews() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Đánh giá mới
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {recentReviews.map((review, index) => (
          <div key={index} className="flex space-x-3">
            <img
              src={review.avatar}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {review.name}
                </span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {review.comment}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {review.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
