import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface CarouselProps {
  children: React.ReactNode[];
  autoplayDelay?: number;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  className?: string;
  isRtl?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoplayDelay = 4000,
  slidesPerView = 1,
  spaceBetween = 20,
  className,
  isRtl = true,
}) => {
  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        dir={isRtl ? 'rtl' : 'ltr'}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        autoplay={autoplayDelay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
        className={className}
      >
        {children.map((child, idx) => (
          <SwiperSlide key={idx} className="h-full w-full">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
export { SwiperSlide };
