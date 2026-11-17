"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper.css";
import Image from "next/image";

const images = [
  { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", label: "Gourmet Starters" },
  { src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800", label: "Wedding Feast" },
  { src: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800", label: "Live Counters" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", label: "Event Setup" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", label: "Fine Dining" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", label: "Dessert Spread" },
];

export default function GallerySlider() {
  return (
    <section id="gallery" className="py-16 md:py-24 px-6" style={{ background: "#1A0A0A" }}>
      <div className="max-w-7xl mx-auto text-center">
        <span className="font-semibold tracking-widest uppercase text-sm" style={{ color: "#C9A227" }}>
          Our Work
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
          Gallery
        </h2>
        <p className="max-w-xl mx-auto mb-14 text-sm leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.75 }}>
          A glimpse of the beautiful spreads and events we have had the honour of catering.
        </p>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-12"
        >
          {images.map((img) => (
            <SwiperSlide key={img.label}>
              <div
                className="relative overflow-hidden rounded-3xl group"
                style={{ border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <Image
                  src={img.src}
                  alt={`Royal Caterers — ${img.label}`}
                  width={800}
                  height={380}
                  loading="lazy"
                  className="h-[380px] w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6"
                  style={{ background: "linear-gradient(to top,rgba(128,0,32,0.85),transparent)" }}
                >
                  <span className="font-semibold text-lg" style={{ color: "#FFFFF0" }}>{img.label}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
