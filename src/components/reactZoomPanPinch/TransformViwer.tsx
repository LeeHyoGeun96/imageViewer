import { memo, useEffect, useRef } from "react";
import { ReactZoomPanPinchRef, TransformWrapper } from "react-zoom-pan-pinch";
import { ImageData } from "../../api/imageApi";
import ZoomControls from "./ZoomControls";
import ImageRenderer from "./ImageRenderer ";

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

  useEffect(() => {
    if (transformRef.current && transformRef.current.resetTransform) {
      // 애니메이션 없이 빠르게 리셋
      transformRef.current.resetTransform(0);
    }
  }, [currentImageSrcMetadata.id]);

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      disablePadding={true}
      onInit={(ref) => {
        transformRef.current = ref;
      }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="absolute inset-0 w-full h-full">
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
