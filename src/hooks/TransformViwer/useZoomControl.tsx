import { useCallback, useRef, useState } from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import type Swiper from "swiper";

type onTransformedProps = {
  scale: number;
  positionX: number;
  positionY: number;
};

interface UseZoomControlProps {
  swiper: Swiper;
  isCurrentImage: boolean;
}

function useZoomControl({ swiper, isCurrentImage }: UseZoomControlProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleZoomChange = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      if (!isCurrentImage) {
        return;
      }

      setIsZoomed(ref.state.scale > 1);
    },
    [isCurrentImage]
  );

  const handleZoomStop = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      if (!isCurrentImage) {
        return;
      }

      setIsZoomed(ref.state.scale > 1.05);
    },
    [isCurrentImage]
  );

  const handleTransformed = useCallback(
    (_: ReactZoomPanPinchRef, state: onTransformedProps) => {
      if (!isCurrentImage) {
        return;
      }
      if (swiper) {
        // 확대되지 않은 상태(1.05 이하)에서만 스와이퍼 터치 허용
        swiper.allowTouchMove = state.scale <= 1.05;
      }
    },
    [swiper, isCurrentImage]
  );

  const customZoomIn = useCallback(() => {
    if (!isCurrentImage) {
      return;
    }
    transformRef.current?.zoomIn(0.5);
    setTimeout(() => {
      if (transformRef.current) {
        setIsZoomed(transformRef.current.state.scale > 1.05);
      }
    }, 100);
  }, [isCurrentImage]);

  const customZoomOut = useCallback(() => {
    if (!isCurrentImage) {
      return;
    }
    transformRef.current?.zoomOut(0.5);
    setTimeout(() => {
      if (transformRef.current) {
        setIsZoomed(transformRef.current.state.scale > 1.05);
      }
    }, 100);
  }, [isCurrentImage]);

  const customResetTransform = useCallback(() => {
    if (!isCurrentImage) {
      return;
    }
    transformRef.current?.resetTransform();
    setTimeout(() => {
      setIsZoomed(false);
    }, 100);
  }, [isCurrentImage]);

  const customSetTransform = useCallback(
    (positionX: number, positionY: number) => {
      if (!isCurrentImage) {
        return;
      }
      transformRef.current?.setTransform(
        positionX,
        positionY,
        transformRef.current.state.scale,
        0.2
      );
    },
    [isCurrentImage]
  );

  return {
    isZoomed,
    transformRef,
    handleZoomChange,
    handleZoomStop,
    handleTransformed,
    customZoomIn,
    customZoomOut,
    customResetTransform,
    customSetTransform,
  };
}

export default useZoomControl;
