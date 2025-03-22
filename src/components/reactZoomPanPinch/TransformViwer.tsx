import { TransformWrapper } from "react-zoom-pan-pinch";

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
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
      disablePadding={true}
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

export default TransformViwer;
