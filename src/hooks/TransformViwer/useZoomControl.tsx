import { useCallback, useRef, useState } from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import type Swiper from "swiper";

type onTransformedProps = {
  scale: number;
  positionX: number;
  positionY: number;
};

function useZoomControl(swiper: Swiper) {
  const [isZoomed, setIsZoomed] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleZoomChange = useCallback((ref: ReactZoomPanPinchRef) => {
    setIsZoomed(ref.state.scale > 1);
  }, []);

  const handleZoomStop = useCallback((ref: ReactZoomPanPinchRef) => {
    setIsZoomed(ref.state.scale > 1.05);
  }, []);

  const handleTransformed = useCallback(
    (_: ReactZoomPanPinchRef, state: onTransformedProps) => {
      if (swiper) {
        // 확대되지 않은 상태(1.05 이하)에서만 스와이퍼 터치 허용
        swiper.allowTouchMove = state.scale <= 1.05;
      }
    },
    [swiper]
  );

  return {
    isZoomed,
    transformRef,
    handleZoomChange,
    handleZoomStop,
    handleTransformed,
  };
}

export default useZoomControl;
