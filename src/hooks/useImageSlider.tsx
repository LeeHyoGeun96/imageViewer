import { useRef, useCallback, useState } from "react";
import { SwiperGalleryRef } from "../components/SwiperGallery/SwiperGallery";

interface UseImageSliderProps {
  initialIndex: number;
  onIndexChange?: (index: number) => void;
}

export function useImageSlider({
  initialIndex,
  onIndexChange,
}: UseImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const galleryRef = useRef<SwiperGalleryRef>(null);

  // 슬라이드 변경 시 호출되는 콜백
  const handleSlideChange = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      if (onIndexChange) {
        onIndexChange(index);
      }
    },
    [onIndexChange]
  );

  // 이전 슬라이드로 이동
  const slidePrev = useCallback(() => {
    galleryRef.current?.slidePrev();
  }, []);

  // 다음 슬라이드로 이동
  const slideNext = useCallback(() => {
    galleryRef.current?.slideNext();
  }, []);

  // 특정 인덱스의 슬라이드로 이동
  const slideTo = useCallback((index: number) => {
    galleryRef.current?.slideTo(index);
  }, []);

  return {
    currentIndex,
    galleryRef,
    handleSlideChange,
    slidePrev,
    slideNext,
    slideTo,
  };
}
