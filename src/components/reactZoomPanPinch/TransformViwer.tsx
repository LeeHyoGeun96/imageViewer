import { memo, useEffect } from "react";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { ImageData } from "../../api/imageApi";
import ZoomControls from "./ZoomControls";
import { useSwiper } from "swiper/react";
import ImageRenderer from "./ImageRenderer ";
import DoubleClickIconSVG from "../../assets/customIcon/doubleClickIcon.svg?react";
import { IoReloadSharp } from "react-icons/io5";

import useSwipeMessage from "../../hooks/TransformViwer/useSwipeMessage";
import useZoomControl from "../../hooks/TransformViwer/useZoomControl";
import usePanningControl from "../../hooks/TransformViwer/usePanningControl";

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
  const swiper = useSwiper();
  const {
    isZoomed,
    transformRef,
    handleZoomChange,
    handleZoomStop,
    handleTransformed,
  } = useZoomControl(swiper);
  const { showMessage, showSwipeMessage } = useSwipeMessage(isZoomed);
  const { debouncedHandlePanning, handlePanningStop } = usePanningControl(
    isZoomed,
    showSwipeMessage
  );
  const isCurrentImage = currentImageSrcMetadata.id === currentIndex;

  // 이미지가 변경될 때 transform 초기화
  useEffect(() => {
    if (transformRef.current?.resetTransform) {
      transformRef.current.resetTransform(0);
    }
  }, [currentImageSrcMetadata.id, transformRef]);

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
