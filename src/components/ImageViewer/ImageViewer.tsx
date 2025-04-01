// ImageViewerWrapper.tsx
import { ZoomScreenReaderProvider } from "../../context/ZoomScreenReaderProvider";
import ImageViewerBase from "./ImageViewerBase";
import { ImagesMetadatasResponse } from "../../api/imageApi";

interface ImageViewerWrapperProps {
  currentIndex: number;
  thumbnailMetadatas?: ImagesMetadatasResponse;
  containerClass?: string;
  imageMetadatas?: ImagesMetadatasResponse;
  onIndexChange: (index: number) => void;
}

export default function ImageViewer(props: ImageViewerWrapperProps) {
  return (
    <ZoomScreenReaderProvider>
      <ImageViewerBase {...props} />
    </ZoomScreenReaderProvider>
  );
}
