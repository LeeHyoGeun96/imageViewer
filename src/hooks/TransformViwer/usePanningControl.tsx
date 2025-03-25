import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

function usePanningControl(isZoomed: boolean, showSwipeMessage: () => void) {
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const panDirectionRef = useRef<"left" | "right" | null>(null);
  const boundaryReachedRef = useRef<"left" | "right" | null>(null);

  const handlePanning = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      if (!isZoomed || !ref.instance.wrapperComponent) return;

      const { positionX, scale } = ref.state;
      const wrapperElement = ref.instance.wrapperComponent;

      // 패닝 방향 감지
      if (positionX < lastPositionRef.current.x) {
        panDirectionRef.current = "left";
      } else if (positionX > lastPositionRef.current.x) {
        panDirectionRef.current = "right";
      }

      // 이미지 경계 계산
      const wrapperWidth = wrapperElement.offsetWidth;
      const contentWidth = wrapperWidth * scale;
      const maxPositionX = 0;
      const minPositionX = -(contentWidth - wrapperWidth);

      // 경계 도달 감지
      const threshold = 1;
      const isAtRightEdge = Math.abs(positionX - maxPositionX) < threshold;
      const isAtLeftEdge = Math.abs(positionX - minPositionX) < threshold;

      if (isAtRightEdge) {
        boundaryReachedRef.current = "right";
      } else if (isAtLeftEdge) {
        boundaryReachedRef.current = "left";
      } else {
        boundaryReachedRef.current = null;
      }

      // 경계에서의 스와이프 시도 감지
      const isSwipingBeyondBoundary =
        (boundaryReachedRef.current === "right" &&
          panDirectionRef.current === "right") ||
        (boundaryReachedRef.current === "left" &&
          panDirectionRef.current === "left");

      if (isSwipingBeyondBoundary) {
        showSwipeMessage();
      }

      lastPositionRef.current = { x: positionX, y: ref.state.positionY };
    },
    [isZoomed, showSwipeMessage]
  );

  const handlePanningStop = useCallback(() => {
    panDirectionRef.current = null;
  }, []);

  // 디바운스된 패닝 핸들러
  const debouncedHandlePanning = useMemo(
    () => debounce((ref: ReactZoomPanPinchRef) => handlePanning(ref), 16), // 약 60fps
    [handlePanning]
  );

  // 클린업
  useEffect(() => {
    const currentDebouncedHandler = debouncedHandlePanning;
    return () => {
      currentDebouncedHandler.cancel();
    };
  }, [debouncedHandlePanning]);

  return { debouncedHandlePanning, handlePanningStop };
}

export default usePanningControl;
