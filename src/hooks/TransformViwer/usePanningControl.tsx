import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import type { ReactZoomPanPinchRef as ReactZoomPanPinchRefType } from "react-zoom-pan-pinch";

interface UsePanningControlProps {
  isZoomed: boolean;
  showSwipeMessage: () => void;
  setTransform: (positionX: number, positionY: number) => void;
  isCurrentImage: boolean;
  transformRef: ReactZoomPanPinchRefType | null;
}

const BASE_PAN_STEP = 100;

function usePanningControl({
  isZoomed,
  showSwipeMessage,
  setTransform,
  isCurrentImage,
  transformRef,
}: UsePanningControlProps) {
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const panDirectionRef = useRef<"left" | "right" | null>(null);
  const boundaryReachedRef = useRef<"left" | "right" | null>(null);
  const isPanningRef = useRef(false); // 현재 터치/마우스로 패닝 중인지 추적

  const handlePanning = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      if (!isCurrentImage) return;
      if (!isZoomed) return;

      // 마우스/터치 패닝 시작 시 플래그 설정
      isPanningRef.current = true;

      const { positionX, scale } = ref.state;
      const wrapperElement = ref.instance.wrapperComponent;

      // 패닝 방향 감지
      if (positionX < lastPositionRef.current.x) {
        panDirectionRef.current = "left";
      } else if (positionX > lastPositionRef.current.x) {
        panDirectionRef.current = "right";
      }

      // 이미지 경계 계산
      const wrapperWidth = wrapperElement?.offsetWidth ?? 0;
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
    [isZoomed, showSwipeMessage, isCurrentImage]
  );

  const handlePanningStop = useCallback(() => {
    if (!isCurrentImage) return;
    panDirectionRef.current = null;
    isPanningRef.current = false; // 마우스/터치 패닝 종료 시 플래그 해제
  }, [isCurrentImage]);

  // 디바운스된 패닝 핸들러
  const debouncedHandlePanning = useMemo(
    () => debounce((ref: ReactZoomPanPinchRef) => handlePanning(ref), 16), // 약 60fps
    [handlePanning]
  );

  // 패닝 속도 계산 함수 (확대 비율과 키 조합에 따라 조정)
  const calculatePanStep = useCallback(
    (scale: number, event: KeyboardEvent) => {
      if (!isCurrentImage) return;
      // 기본 패닝 단계 (정상 속도)

      // 확대 비율에 반비례하게 조정 (확대할수록 더 작게 이동)
      const scaleAdjustedStep = BASE_PAN_STEP / scale;

      // 키 조합에 따른 속도 조정 (Shift: 고속, Ctrl: 저속)
      if (event.shiftKey) {
        return scaleAdjustedStep * 2.5; // 빠른 이동 (250%)
      } else if (event.ctrlKey || event.metaKey) {
        return scaleAdjustedStep * 0.25; // 미세 이동 (25%)
      }

      return scaleAdjustedStep;
    },
    [isCurrentImage]
  );

  // 키보드 방향키로 패닝하는 함수
  const handleKeyboardPanning = useCallback(
    (direction: "left" | "right" | "up" | "down", event: KeyboardEvent) => {
      if (!isZoomed || isPanningRef.current || !transformRef || !isCurrentImage)
        return;

      const ref = transformRef;

      const { state, instance } = ref;

      if (!instance.wrapperComponent) return;

      // 이동 거리 계산 (확대 비율과 키 조합에 따라 조정)
      const panStep = calculatePanStep(state.scale, event) || 0;

      // 현재 위치
      const currentX = state.positionX;
      const currentY = state.positionY;

      // 이미지 경계 계산
      const wrapperWidth = instance.wrapperComponent.offsetWidth;
      const wrapperHeight = instance.wrapperComponent.offsetHeight;
      const contentWidth = wrapperWidth * state.scale;
      const contentHeight = wrapperHeight * state.scale;

      // 경계값 계산 (약간의 여유 공간 추가)
      const maxPositionX = 0;
      const minPositionX = Math.min(0, -(contentWidth - wrapperWidth));
      const maxPositionY = 0;
      const minPositionY = Math.min(0, -(contentHeight - wrapperHeight));

      // 새 위치 계산
      let newX = currentX;
      let newY = currentY;

      switch (direction) {
        case "left":
          newX = Math.min(maxPositionX, currentX + panStep);
          break;
        case "right":
          newX = Math.max(minPositionX, currentX - panStep);
          break;
        case "up":
          newY = Math.min(maxPositionY, currentY + panStep);
          break;
        case "down":
          newY = Math.max(minPositionY, currentY - panStep);
          break;
      }

      // 애니메이션 적용하여 부드럽게 이동 (라이브러리의 setTransform 함수 사용)
      if (setTransform) {
        setTransform(newX, newY); // 200ms 애니메이션
      } else if (instance.setTransformState) {
        // 대체 메서드가 있는 경우 사용
        instance.setTransformState(newX, newY, state.scale);
      }

      // 경계 도달 상태 업데이트
      const threshold = 1;
      if (Math.abs(newX - maxPositionX) < threshold) {
        boundaryReachedRef.current = "right";
      } else if (Math.abs(newX - minPositionX) < threshold) {
        boundaryReachedRef.current = "left";
      } else {
        boundaryReachedRef.current = null;
      }

      // 경계에서 계속 이동하려고 할 때 메시지 표시
      if (
        (direction === "right" && boundaryReachedRef.current === "left") ||
        (direction === "left" && boundaryReachedRef.current === "right")
      ) {
        showSwipeMessage();
      }
    },
    [
      isZoomed,
      showSwipeMessage,
      calculatePanStep,
      isCurrentImage,
      setTransform,
      transformRef,
    ]
  );

  // 클린업
  useEffect(() => {
    const currentDebouncedHandler = debouncedHandlePanning;
    return () => {
      currentDebouncedHandler.cancel();
    };
  }, [debouncedHandlePanning]);

  return { debouncedHandlePanning, handlePanningStop, handleKeyboardPanning };
}

export default usePanningControl;
