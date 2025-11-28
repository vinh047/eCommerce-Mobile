import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { formatPrice } from "@/utils/format";

const baseUrlImage = "/assets/products/";

function RatingStars({ rating }) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} />
      ))}
      {hasHalfStar && <FaStarHalfAlt key="half" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  // THAY ĐỔI: Logic kiểm tra và tính toán giảm giá
  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);

  let discountPercentage = 0;
  if (hasDiscount) {
    discountPercentage = Math.round(
      ((Number(product.compareAtPrice) - Number(product.price)) /
        Number(product.compareAtPrice)) *
        100
    );
  }
  return (
    <Link href={`/san-pham/${product.slug}`}>
      <div className="my-2 mx-2 group bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-shadow duration-300 ease-in-out p-3 flex flex-col items-center text-center cursor-pointer min-h-[325px]">
        {/* Ảnh sản phẩm */}
        <div className="relative w-full h-48 rounded-lg mb-1 overflow-hidden flex justify-center items-center">
          <Image
            src={`${baseUrlImage}${product.image}`}
            alt={product.name}
            className="object-contain p-2 transition-transform duration-200 ease-in-out group-hover:-translate-y-1.5"
            placeholder="empty"
            fill={true}
          />
        </div>

        {/* Tên sản phẩm */}
        <h3 className="text-sm font-medium text-neutral-800 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Giá */}
        <div className="flex flex-col items-center justify-center min-h-[42px] mb-1">
          {hasDiscount ? (
            <>
              <p className="text-blue-600 font-bold text-md">
                {formatPrice(Number(product.price))}
              </p>
              {/* Giá gốc (ở trên) */}
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(Number(product.compareAtPrice))}
              </p>
              {/* Giá bán (ở dưới) */}
            </>
          ) : (
            // Khi không giảm giá, giá bán sẽ được căn giữa trong container
            <p className="text-blue-600 font-bold text-md">
              {formatPrice(Number(product.price))}
            </p>
          )}
        </div>

        {/* Đánh giá */}
        <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
          <RatingStars
            rating={
              Number(product.ratingAvg) === 0 ? 5 : Number(product.ratingAvg)
            }
          />
          <span className="text-sm ms-0.5 mt-1">
            ({Number(product.ratingAvg) === 0 ? 5 : Number(product.ratingAvg)})
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
