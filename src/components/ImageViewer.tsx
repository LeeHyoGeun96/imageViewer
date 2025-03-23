import { useState, useRef } from "react";
import { ImagesMetadataResponse, ImageData } from "../api/imageApi";
import { Skeleton } from "./UI/Skeleton";
import ThumbnailPanel from "./ImageViewer/ThumbnailPanel";
import NavigationControls from "./ImageViewer/NavigationControls";
import SwiperGallery from "./SwiperGallery/SwiperGallery";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useFullscreen } from "../hooks/useFullscreen";
import { useThumbnailLoader } from "../hooks/useThumbnailLoader";
import { useImageSlider } from "../hooks/useImageSlider";
import { useFocusManagement } from "../hooks/useFocusManagement";

interface ImageViewerProps {
  currentIndex: number;
  thumbnailMetadata?: ImagesMetadataResponse;
  containerClass?: string;
  totalImagesNumber: number;
  mainImageIsLoaded?: boolean;
  currentImageSrcMetadata?: ImageData;
  imageMetadatas?: ImageData[];
  onIndexChange: (index: number) => void;
}

export default function ImageViewer({
  currentIndex,
  totalImagesNumber,
  thumbnailMetadata = { images: [], totalImages: 0 },
  mainImageIsLoaded = false,
  containerClass = "",
  imageMetadatas,
  onIndexChange,
}: ImageViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 커스텀 훅 사용
  const { galleryRef, handleSlideChange, slidePrev, slideNext, slideTo } =
    useImageSlider({ initialIndex: currentIndex, onIndexChange });

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  const { loadedThumbnails } = useThumbnailLoader(thumbnailMetadata);

  useFocusManagement({ isExpanded, focusElementRef: closeButtonRef });

  useKeyboardNavigation({
    onPrev: slidePrev,
    onNext: slideNext,
    onFullscreen: toggleFullscreen,
    onEscapeExpanded: () => setIsExpanded(false),
    isExpanded,
  });

  // Swiper 슬라이드 변경 시 인덱스 업데이트
  const handleThumbnailClick = (index: number) => {
    slideTo(index);
    setIsExpanded(false);
  };

  return (
    <section
      className={`relative rounded-lg overflow-hidden group aspect-[4/3] max-h-[80vh]   ${
        isFullscreen ? "h-screen bg-black" : ""
      } ${containerClass}`}
      ref={containerRef}
      aria-label="이미지 갤러리"
      tabIndex={0}
    >
      {/* 네비게이션 컨트롤 */}
      <NavigationControls
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
        currentIndex={currentIndex}
        totalImagesNumber={totalImagesNumber}
        onNext={slideNext}
        onPrev={slidePrev}
      />

      {/* 이미지 슬라이더 컨테이너 */}

      {imageMetadatas && imageMetadatas.length > 0 ? (
        <SwiperGallery
          ref={galleryRef}
          images={imageMetadatas}
          initialIndex={currentIndex}
          onSlideChange={handleSlideChange}
          imagesLoaded={mainImageIsLoaded}
        />
      ) : (
        <Skeleton aria-label="이미지 로딩 중" />
      )}

      {/* 썸네일 패널 */}
      <ThumbnailPanel
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        currentIndex={currentIndex}
        totalImagesNumber={totalImagesNumber}
        loadedThumbnails={loadedThumbnails}
        onThumbnailClick={handleThumbnailClick}
        closeButtonRef={closeButtonRef}
      />

      <div
        className="absolute z-10  bottom-4 left-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm cursor-default control-visibility"
        aria-live="polite"
      >
        {currentIndex + 1} / {totalImagesNumber}
      </div>
    </section>
  );
}
