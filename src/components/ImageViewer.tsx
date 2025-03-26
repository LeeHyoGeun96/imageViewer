import { useState, useRef, useEffect } from "react";
import { ImagesMetadatasResponse } from "../api/imageApi";
import { Skeleton } from "./UI/Skeleton";
import ThumbnailPanel from "./ImageViewer/ThumbnailPanel";
import NavigationControls from "./ImageViewer/NavigationControls";
import SwiperGallery from "./SwiperGallery/SwiperGallery";
import { useKeyboardNavigation } from "../hooks/ImageViewer/useKeyboardNavigation";
import { useFullscreen } from "../hooks/ImageViewer/useFullscreen";
import { useThumbnailLoader } from "../hooks/ImageViewer/useThumbnailLoader";
import { useImageSlider } from "../hooks/ImageViewer/useImageSlider";
import { useFocusManagement } from "../hooks/ImageViewer/useFocusManagement";
import { useScreenOrientation } from "../hooks/ImageViewer/useScreenOrientation";

interface ImageViewerProps {
  currentIndex: number;
  thumbnailMetadatas?: ImagesMetadatasResponse;
  containerClass?: string;
  imageMetadatas?: ImagesMetadatasResponse;
  onIndexChange: (index: number) => void;
}

export default function ImageViewer({
  currentIndex,
  thumbnailMetadatas = { images: [] },
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
  const { loadedThumbnails } = useThumbnailLoader(thumbnailMetadatas);
  useFocusManagement({ isExpanded, focusElementRef: closeButtonRef });
  const {
    orientation,
    isSupported: isOrientationSupported,
    toggleOrientation,
    unlockOrientation,
  } = useScreenOrientation();
  useKeyboardNavigation({
    onPrev: slidePrev,
    onNext: slideNext,
    onFullscreen: toggleFullscreen,
    onEscapeExpanded: () => setIsExpanded(false),
    isExpanded,
  });

  useEffect(() => {
    if (!isFullscreen && isOrientationSupported) {
      unlockOrientation();
    }
  }, [isFullscreen, isOrientationSupported, unlockOrientation]);

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
        totalImagesNumber={imageMetadatas?.images.length}
        totalThumbnailsNumber={thumbnailMetadatas?.images.length}
        onNext={slideNext}
        onPrev={slidePrev}
        orientation={orientation}
        isOrientationSupported={isOrientationSupported}
        toggleOrientation={toggleOrientation}
      />

      {/* 이미지 슬라이더 컨테이너 */}

      {imageMetadatas && imageMetadatas.images.length > 0 ? (
        <SwiperGallery
          ref={galleryRef}
          imageMetadatas={imageMetadatas}
          initialIndex={currentIndex}
          onSlideChange={handleSlideChange}
        />
      ) : (
        <Skeleton aria-label="이미지 로딩 중" spinnerSize={16} />
      )}

      {/* 썸네일 패널 */}
      <ThumbnailPanel
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        currentIndex={currentIndex}
        totalImagesNumber={thumbnailMetadatas?.images.length}
        loadedThumbnails={loadedThumbnails}
        onThumbnailClick={handleThumbnailClick}
        closeButtonRef={closeButtonRef}
      />
    </section>
  );
}
