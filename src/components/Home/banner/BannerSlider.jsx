"use client";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ROUTES } from "@/config/routes";

export default function BannerSlider({ banners }) {
  return (
    <div className="relative aspect-15/6 w-full rounded-xl overflow-hidden bg-white group">
      <Swiper
        modules={[Navigation, Autoplay]}
        loop
        autoplay={{ delay: 5000 }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide
            key={banner.id}
            className="flex items-center justify-center"
          >
            <Link href={ROUTES.productDetail(banner.product.slug)}>
              <img
                src={`/assets/products/${banner.image}`}
                className="max-h-full w-full object-contain"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
