import { memo, useEffect, useRef } from "react";
import { ReactZoomPanPinchRef, TransformWrapper } from "react-zoom-pan-pinch";
import { ImageData } from "../../api/imageApi";
import ZoomControls from "./ZoomControls";
import { useSwiper } from "swiper/react";
import ImageRenderer from "./ImageRenderer ";

type onTransformedProps = {
  scale: number;
  positionX: number;
  positionY: number;
};
interface TransformViwerProps {
  currentImageSrcMetadata?: ImageData;
  isLoaded: boolean;
}

const TransformViwer = ({
  currentImageSrcMetadata = {
    id: 0,
    src: "",
    alt: "",
  },
}: TransformViwerProps) => {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const swiper = useSwiper();

  useEffect(() => {
    if (transformRef.current && transformRef.current.resetTransform) {
      transformRef.current.resetTransform(0);
    }
  }, [currentImageSrcMetadata.id]);

  // Swiper와의 통합을 위한 이벤트 처리
  const handleTransformed = (
    _: ReactZoomPanPinchRef,
    state: onTransformedProps
  ) => {
    if (swiper) {
      // 확대 상태에 따라 Swiper의 터치 이벤트 제어
      if (state.scale > 1.05) {
        // 확대된 상태에서는 스와이프 비활성화
        swiper.allowTouchMove = false;
      } else {
        // 원본 크기에서는 스와이프 활성화
        swiper.allowTouchMove = true;
      }
    }
  };

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      disablePadding={true}
      onInit={(ref) => {
        transformRef.current = ref;
      }}
      onTransformed={handleTransformed}
      doubleClick={{
        mode: "toggle", // 더블 클릭 시 원래 크기로 초기화
      }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="  absolute inset-0 w-full h-full">
          <ZoomControls
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetTransform={resetTransform}
          />
          <ImageRenderer imageMetadata={currentImageSrcMetadata} />
        </div>
      )}
    </TransformWrapper>
  );
};

// 메모이제이션 적용
export default memo(TransformViwer);
