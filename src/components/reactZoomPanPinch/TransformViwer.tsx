import { memo, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ReactZoomPanPinchRef, TransformWrapper } from "react-zoom-pan-pinch";
import { ImageData } from "../../api/imageApi";
import ZoomControls from "./ZoomControls";
import { useSwiper } from "swiper/react";
import ImageRenderer from "./ImageRenderer ";
import DoubleClickIconSVG from "../../assets/customIcon/doubleClickIcon.svg?react";
import { IoReloadSharp } from "react-icons/io5";
import { debounce } from "lodash";

type onTransformedProps = {
  scale: number;
  positionX: number;
  positionY: number;
};

interface TransformViwerProps {
  currentImageSrcMetadata?: ImageData;
  currentIndex: number;
}

const TransformViwer = ({
  currentImageSrcMetadata = {
    id: 0,
    src: "",
    alt: "",
  },
  currentIndex,
}: TransformViwerProps) => {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const swiper = useSwiper();
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const messageTimerRef = useRef<number | null>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const panDirectionRef = useRef<"left" | "right" | null>(null);
  const boundaryReachedRef = useRef<"left" | "right" | null>(null);
  const lastMessageTimeRef = useRef<number>(0);

  const isCurrentImage = currentImageSrcMetadata.id === currentIndex;

  // 메시지 표시 로직
  const showSwipeMessage = useCallback(() => {
    if (!isZoomed) return;

    const now = Date.now();
    if (now - lastMessageTimeRef.current > 500) {
      setShowMessage(true);
      lastMessageTimeRef.current = now;

      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }

      messageTimerRef.current = setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
  }, [isZoomed]);

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

      // 이미지 크기 및 경계 계산
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

  const handleTransformed = useCallback(
    (_: ReactZoomPanPinchRef, state: onTransformedProps) => {
      if (swiper) {
        swiper.allowTouchMove = state.scale <= 1.05;
      }
    },
    [swiper]
  );

  const handleZoomChange = useCallback((ref: ReactZoomPanPinchRef) => {
    setIsZoomed(ref.state.scale > 1);
  }, []);

  const handleZoomStop = useCallback((ref: ReactZoomPanPinchRef) => {
    setIsZoomed(ref.state.scale > 1.05);
  }, []);

  // 디바운스된 패닝 핸들러
  const debouncedHandlePanning = useMemo(
    () => debounce((ref: ReactZoomPanPinchRef) => handlePanning(ref), 16),
    [handlePanning]
  );

  // 이미지가 변경될 때 transform 초기화
  useEffect(() => {
    if (transformRef.current?.resetTransform) {
      transformRef.current.resetTransform(0);
    }
  }, [currentImageSrcMetadata.id]);

  // 클린업 로직
  useEffect(() => {
    const currentDebouncedHandler = debouncedHandlePanning;

    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
      currentDebouncedHandler.cancel();
    };
  }, [debouncedHandlePanning]);

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      disablePadding={true}
      onInit={(ref) => {
        transformRef.current = ref;
      }}
      limitToBounds={true}
      doubleClick={{
        mode: isZoomed ? "reset" : "zoomIn",
      }}
      onZoom={handleZoomChange}
      onZoomStop={handleZoomStop}
      onPanning={debouncedHandlePanning}
      onPanningStop={handlePanningStop}
      onTransformed={handleTransformed}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="absolute inset-0 w-full h-full">
          <ZoomControls
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetTransform={resetTransform}
            isCurrentImage={isCurrentImage}
          />
          <ImageRenderer imageMetadata={currentImageSrcMetadata} />

          {/* 안내 메시지 */}
          {showMessage && (
            <div className="absolute bottom-20 md:bottom-4 text-xs left-1/2 -translate-x-1/2 text-white bg-black/60 rounded-2xl px-3 py-1">
              <div className="flex items-center gap-1">
                <DoubleClickIconSVG className="size-20 fill-white " />
                <span className="mx-1">또는</span>
                <IoReloadSharp className="size-20" />
                <span>을 사용하여 이미지를 초기화 하고 스와이프 하세요</span>
              </div>
            </div>
          )}
        </div>
      )}
    </TransformWrapper>
  );
};

export default memo(TransformViwer);
