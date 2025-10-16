"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { lazy } from "react";
const ProductCard = lazy(() => import("@/components/ui/product/ProductCard"));

function CategoryProducts({ title, products }) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={8}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
      className="relative swiper-custom"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CategoryProducts;
