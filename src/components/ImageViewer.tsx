import { useEffect, useState, useCallback, useRef } from "react";
import TransformViwer from "./reactZoomPanPinch/TransformViwer";
import { ImagesMetadataResponse, ImageData } from "../api/imageApi";
import { Skeleton } from "./UI/Skeleton";
import ThumbnailPanel from "./ImageViewer/ThumbnailPanel";
import NavigationControls from "./ImageViewer/NavigationControls";

interface ImageViewerProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  thumbnailMetadata?: ImagesMetadataResponse;
  containerClass?: string;
  totalImagesNumber: number;
  mainImageIsLoaded?: boolean;
  currentImageSrcMetadata?: ImageData;
}

export default function ImageViewer({
  currentIndex,
  totalImagesNumber,
  onIndexChange,
  thumbnailMetadata = { images: [], totalImages: 0 },
  mainImageIsLoaded = false,
  containerClass = "h-[500px]",
  currentImageSrcMetadata,
}: ImageViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<
    Map<number, ImageData>
  >(new Map());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const containerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // 전체화면 토글 함수
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      // 전체화면으로 전환
      containerRef.current.requestFullscreen().catch((err) => {
        console.log(`전체화면 전환 불가: ${err.message}`);
      });
    } else {
      // 전체화면 종료
      document.exitFullscreen().catch((err) => {
        console.log(`전체화면 종료 불가: ${err.message}`);
      });
    }
  }, []);

  // 전체화면 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 포커스 관리
  useEffect(() => {
    if (isExpanded) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 100);
    } else {
      setTimeout(() => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus();
        }
      }, 100);
    }
  }, [isExpanded]);

  const handlePrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + totalImagesNumber) % totalImagesNumber);
  }, [onIndexChange, totalImagesNumber, currentIndex]);

  const handleNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % totalImagesNumber);
  }, [onIndexChange, totalImagesNumber, currentIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handlePrev, handleNext, toggleFullscreen, isExpanded]);

  // 썸네일 이미지 로드
  useEffect(() => {
    if (!thumbnailMetadata || thumbnailMetadata.images.length === 0) return;
    const totalImages = thumbnailMetadata.images.length;

    // 배치 크기 설정 - 5개씩 로드
    const BATCH_SIZE = 5;

    const loadThumbnails = async () => {
      for (
        let batchStart = 0;
        batchStart < totalImages;
        batchStart += BATCH_SIZE
      ) {
        // 현재 배치의 끝 인덱스 계산 (totalImages를 초과하지 않도록)
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalImages);

        // 현재 배치의 이미지들을 로드
        for (let i = batchStart; i < batchEnd; i++) {
          const thumbData = thumbnailMetadata.images[i];
          if (!thumbData) continue;

          const img = new Image();

          img.onload = () => {
            setLoadedThumbnails((prev) => {
              const newMap = new Map(prev);
              newMap.set(thumbData.id, thumbData);
              return newMap;
            });
          };

          // 로드 시작
          img.src = thumbData.src;
        }

        // 한 배치 로드 후 지연 - 다음 배치 로드 전에 약간의 지연을 줌
        if (batchEnd < totalImages) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    };

    loadThumbnails();
  }, [thumbnailMetadata]);

  const handleThumbnailClick = (index: number) => {
    onIndexChange(index);
    setIsExpanded(false);
  };

  return (
    <section
      className={`relative rounded-lg overflow-hidden group ${
        isFullscreen ? "h-screen bg-black" : ""
      }`}
      ref={containerRef}
      aria-label="이미지 갤러리"
      tabIndex={0}
    >
      {/* 네비게이션 컨트롤 */}
      <NavigationControls
        handlePrev={handlePrev}
        handleNext={handleNext}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
        currentIndex={currentIndex}
        totalImagesNumber={totalImagesNumber}
      />

      {/* 이미지 크기 유지를 위한 컨테이너 */}
      <div
        className={`
          ${
            isFullscreen
              ? "h-full max-h-screen"
              : `aspect-[4/3] max-h-[80vh] ${containerClass}`
          }
        `}
      >
        {mainImageIsLoaded ? (
          <TransformViwer
            currentImageSrcMetadata={currentImageSrcMetadata}
            isLoaded={mainImageIsLoaded}
          />
        ) : (
          <Skeleton aria-label="이미지 로딩 중" />
        )}
      </div>

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
        className="absolute bottom-4 left-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm cursor-default control-visibility"
        aria-live="polite"
      >
        {currentIndex + 1} / {totalImagesNumber}
      </div>
    </section>
  );
}
