"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const banners = [
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-15t-5g-home-0925.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/home-app3-opensale.jpg",
  "https://th.bing.com/th/id/OIP.AnLBRs2Lc6EaRZ-XpfULlAHaEK?w=333&h=187&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
];

export default function BannerSlider() {
  return (
    <div className="relative aspect-[15/6] w-full rounded-xl overflow-hidden bg-white group">
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
        {banners.map((src, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="max-h-full w-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
