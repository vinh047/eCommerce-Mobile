import React from "react";

const reviews = [
  {
    id: 1,
    name: "Ngọc Anh",
    content: "Máy mượt, pin ổn, màu xanh rất đẹp. Giao hàng nhanh.",
    rating: 5,
  },
  {
    id: 2,
    name: "Minh Khoa",
    content: "Chụp ảnh tốt, đôi cổng USB-C tiện. Giá ổn khi có khuyến mãi.",
    rating: 4,
  },
  // có thể thêm review khác
];

const Star = ({ filled }) => (
  <span style={{ color: "#FFD700", marginRight: 2 }}>
    {filled ? "★" : "☆"}
  </span>
);

const ReviewCard = ({ review }) => (
  <div
    style={{
      border: "1px solid #e0e0e0",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    }}
  >
    <div style={{ fontWeight: "bold", marginBottom: 8 }}>{review.name}</div>
    <div style={{ marginBottom: 8 }}>{review.content}</div>
    <div>
      {[...Array(5)].map((_, i) => (
        <Star key={i} filled={i < review.rating} />
      ))}
    </div>
  </div>
);

export default function ReviewList() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
      <button
        style={{
          marginTop: 12,
          padding: "8px 16px",
          borderRadius: 4,
          border: "none",
          background: "#1976d2",
          color: "white",
          cursor: "pointer",
        }}
      >
        Xem thêm đánh giá
      </button>
    </div>
  );
}
