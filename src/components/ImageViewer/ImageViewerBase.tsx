import { useState, useRef, useEffect } from "react";
import { ImagesMetadatasResponse } from "../../api/imageApi";
import { Skeleton } from "../UI/Skeleton";
import ThumbnailPanel from "./ThumbnailPanel";
import NavigationControls from "./NavigationControls";
import SwiperGallery from "../SwiperGallery/SwiperGallery";
import { useKeyboardNavigation } from "../../hooks/ImageViewer/useKeyboardNavigation";
import { useFullscreen } from "../../hooks/ImageViewer/useFullscreen";
import { useThumbnailLoader } from "../../hooks/ImageViewer/useThumbnailLoader";
import { useImageSlider } from "../../hooks/ImageViewer/useImageSlider";
import { useFocusManagement } from "../../hooks/ImageViewer/useFocusManagement";
import { useScreenOrientation } from "../../hooks/ImageViewer/useScreenOrientation";
import { useZoomScreenReader } from "../../hooks/useZoomScreenReader";

interface ImageViewerProps {
  /** 현재 표시할 이미지의 인덱스 */
  currentIndex: number;

  /** 썸네일 이미지 메타데이터 (없으면 빈 배열) */
  thumbnailMetadatas?: ImagesMetadatasResponse;

  /** 추가 CSS 클래스명 */
  containerClass?: string;

  /** 메인 이미지 메타데이터 (없으면 스켈레톤 표시) */
  imageMetadatas?: ImagesMetadatasResponse;

  /** 이미지 변경 시 호출되는 함수 */
  onIndexChange: (index: number) => void;
}
interface ImageViewerProps {
  currentIndex: number;
  thumbnailMetadatas?: ImagesMetadatasResponse;
  containerClass?: string;
  imageMetadatas?: ImagesMetadatasResponse;
  onIndexChange: (index: number) => void;
}

export default function ImageViewerBase({
  currentIndex,
  thumbnailMetadatas = { images: [] },
  containerClass = "",
  imageMetadatas,
  onIndexChange,
}: ImageViewerProps) {
  const [isThumbnailExpanded, setIsThumbnailExpanded] = useState(false);
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 커스텀 훅 사용
  const { galleryRef, handleSlideChange, slidePrev, slideNext, slideTo } =
    useImageSlider({ initialIndex: currentIndex, onIndexChange });
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { loadedThumbnails } = useThumbnailLoader(thumbnailMetadatas);
  useFocusManagement({ isThumbnailExpanded, focusElementRef: closeButtonRef });
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
    onEscapeExpanded: () => setIsThumbnailExpanded(false),
    isThumbnailExpanded: isThumbnailExpanded,
    setIsThumbnailExpanded: setIsThumbnailExpanded,
  });
  const { screenReaderEnabled } = useZoomScreenReader();

  useEffect(() => {
    if (!isFullscreen && isOrientationSupported) {
      unlockOrientation();
    }
  }, [isFullscreen, isOrientationSupported, unlockOrientation]);

  // Swiper 슬라이드 변경 시 인덱스 업데이트
  const handleThumbnailClick = (index: number) => {
    slideTo(index);
    setIsThumbnailExpanded(false);
  };

  return (
    <>
      <p className="sr-only" tabIndex={0}>
        스크린 리더를 사용하시는 경우, Ctrl + Alt + s키를 누르면 스크린 리더
        전용 단축키로 변경됩니다.
      </p>
      <div role="status" aria-live="polite" className="sr-only">
        {screenReaderEnabled
          ? "스크린 리더 모드가 활성화되었습니다"
          : "스크린 리더 모드가 비활성화되었습니다"}
      </div>
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
          setIsThumbnailExpanded={setIsThumbnailExpanded}
          isThumbnailExpanded={isThumbnailExpanded}
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
          isThumbnailExpanded={isThumbnailExpanded}
          setIsThumbnailExpanded={setIsThumbnailExpanded}
          currentIndex={currentIndex}
          totalImagesNumber={thumbnailMetadatas?.images.length}
          loadedThumbnails={loadedThumbnails}
          onThumbnailClick={handleThumbnailClick}
          closeButtonRef={closeButtonRef}
        />
        {screenReaderEnabled && (
          <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 rounded-full px-3 py-1">
            스크린 리더 모드가 활성화 되어 있습니다.
            <br />
            끄려면 Ctrl + Alt + s 키를 눌러주세요.
          </div>
        )}
      </section>
    </>
  );
}
