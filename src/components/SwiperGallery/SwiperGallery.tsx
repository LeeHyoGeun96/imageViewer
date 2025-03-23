import React, { useImperativeHandle, forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { ImageData } from "../../api/imageApi";
import TransformViwer from "../reactZoomPanPinch/TransformViwer";

// 외부에서 참조할 수 있는 메서드 정의
export interface SwiperGalleryRef {
  slidePrev: () => void;
  slideNext: () => void;
  slideTo: (index: number) => void;
}

interface SwiperGalleryProps {
  images: ImageData[];
  initialIndex: number;
  onSlideChange: (index: number) => void;
  imagesLoaded?: boolean;
}

// forwardRef를 사용하여 ref 노출
const SwiperGallery = forwardRef<SwiperGalleryRef, SwiperGalleryProps>(
  ({ images, initialIndex, onSlideChange, imagesLoaded = true }, ref) => {
    const [swiperInstance, setSwiperInstance] =
      React.useState<SwiperType | null>(null);

    // 외부에서 사용할 메서드 노출
    useImperativeHandle(ref, () => ({
      slidePrev: () => swiperInstance?.slidePrev(),
      slideNext: () => swiperInstance?.slideNext(),
      slideTo: (index: number) => swiperInstance?.slideTo(index, 0),
    }));

    const handleSlideChange = (swiper: SwiperType) => {
      onSlideChange(swiper.activeIndex);
    };

    return (
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        onSwiper={setSwiperInstance}
        initialSlide={initialIndex}
        mousewheel={false}
        className="h-full w-full"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="w-full h-full flex items-center justify-center">
              <TransformViwer
                currentImageSrcMetadata={image}
                isLoaded={imagesLoaded}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
);

SwiperGallery.displayName = "SwiperGallery";

export default SwiperGallery;
