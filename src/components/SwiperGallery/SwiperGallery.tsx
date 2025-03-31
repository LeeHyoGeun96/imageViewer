import { useImperativeHandle, forwardRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { ImagesMetadatasResponse } from "../../api/imageApi";
import TransformViwer from "../reactZoomPanPinch/TransformViwer";

// 외부에서 참조할 수 있는 메서드 정의
export interface SwiperGalleryRef {
  slidePrev: () => void;
  slideNext: () => void;
  slideTo: (index: number) => void;
}

interface SwiperGalleryProps {
  imageMetadatas: ImagesMetadatasResponse;
  initialIndex: number;
  onSlideChange: (index: number) => void;
  setIsZoomed: React.Dispatch<React.SetStateAction<boolean>>;
}

// forwardRef를 사용하여 ref 노출
const SwiperGallery = forwardRef<SwiperGalleryRef, SwiperGalleryProps>(
  ({ imageMetadatas, initialIndex, onSlideChange, setIsZoomed }, ref) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
      null
    );

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
      <>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          onSwiper={setSwiperInstance}
          initialSlide={initialIndex}
          mousewheel={false}
          nested={true}
          className="h-full w-full"
        >
          {imageMetadatas.images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="w-full h-full flex items-center justify-center">
                <TransformViwer
                  currentImageSrcMetadata={image}
                  currentIndex={initialIndex}
                  setIsZoomed={setIsZoomed}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  }
);

SwiperGallery.displayName = "SwiperGallery";

export default SwiperGallery;
