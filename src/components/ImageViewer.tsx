import { useEffect, useState, useCallback, useRef } from "react";
import TransformViwer from "./reactZoomPanPinch/TransformViwer";
import { ImagesMetadataResponse, ImageData } from "../api/imageApi";
import { Skeleton } from "./UI/Skeleton";
import { GrPrevious, GrNext } from "react-icons/gr";

import { VscChromeClose } from "react-icons/vsc";
import { PiImages } from "react-icons/pi";
import { IoExpand, IoContract } from "react-icons/io5";

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
  const [controlsVisible, setControlsVisible] = useState(false);

  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const thumbnailPanelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // 컨트롤 가시성 관리
  const showControls = () => {
    setControlsVisible(true);
  };

  const hideControls = () => {
    // 포커스가 컨테이너 내부에 없을 때만 컨트롤 숨김
    if (!containerRef.current?.contains(document.activeElement)) {
      setControlsVisible(false);
    }
  };

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

  // 포커스 트래핑
  useEffect(() => {
    if (!isExpanded) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !thumbnailPanelRef.current) return;

      const focusableElements = thumbnailPanelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
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
        showControls();
      } else if (e.key === "ArrowRight") {
        handleNext();
        showControls();
      } else if (e.key === "f") {
        toggleFullscreen();
        showControls();
      } else if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      } else if (e.key === "Tab") {
        // 탭 키 누를 때 컨트롤 표시
        showControls();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handlePrev, handleNext, toggleFullscreen, isExpanded]);

  // 마우스 이벤트 처리
  const handleMouseEnter = () => {
    showControls();
  };

  const handleMouseLeave = () => {
    hideControls();
  };

  // 포커스 이벤트 처리
  const handleFocus = () => {
    showControls();
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      hideControls();
    }
  };

  // 썸네일 이미지 로드
  useEffect(() => {
    if (!thumbnailMetadata || thumbnailMetadata.images.length === 0) return;
    const totalImages = thumbnailMetadata.images.length;

    const loadThumbnails = async () => {
      // 모든 썸네일 이미지 순차적으로 로드
      for (let i = 0; i < totalImages; i++) {
        const thumbData = thumbnailMetadata.images[i];
        if (!thumbData) continue;

        // 이미 로드되었으면 스킵
        if (loadedThumbnails.has(thumbData.id)) continue;

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

        // 더 긴 지연으로 확인 가능하게
        if (i % 5 === 4) {
          await new Promise((r) => setTimeout(r, 50));
        }
      }
    };

    loadThumbnails();
  }, [thumbnailMetadata, loadedThumbnails]);

  const handleThumbnailClick = (index: number) => {
    onIndexChange(index);
    setIsExpanded(false);
  };

  const renderThumbnails = () => {
    return Array.from({ length: totalImagesNumber }).map((_, index) => {
      const isLoaded = loadedThumbnails.has(index);
      const thumbnailData = loadedThumbnails.get(index);

      return (
        <div
          key={index}
          className={`cursor-pointer p-1 aspect-[4/3] ${
            currentIndex === index ? "border-2 border-blue-500" : ""
          }`}
          onClick={() => handleThumbnailClick(index)}
          role="button"
          tabIndex={0}
          aria-label={`이미지 ${index + 1}${
            currentIndex === index ? " (현재 선택됨)" : ""
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleThumbnailClick(index);
            }
          }}
        >
          {isLoaded && thumbnailData ? (
            // 썸네일이 로드된 경우
            <img
              src={thumbnailData.src}
              alt={thumbnailData.alt || `이미지 ${index + 1}`}
              className="w-full h-auto"
            />
          ) : (
            // 썸네일이 아직 로드되지 않은 경우
            <Skeleton
              spinnerSize={10}
              aria-label={`이미지 ${index + 1} 로딩 중`}
            />
          )}
        </div>
      );
    });
  };

  return (
    <section
      className={`relative rounded-lg overflow-hidden group ${
        isFullscreen ? "h-screen bg-black" : ""
      }`}
      ref={containerRef}
      role="region"
      aria-label="이미지 갤러리"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* 이전/다음 버튼 */}

      <button
        ref={prevButtonRef}
        onClick={handlePrev}
        aria-label="이전 이미지"
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 focus:bg-black/80 z-10 cursor-pointer `}
        tabIndex={0}
        type="button"
        onFocus={showControls}
        style={{ pointerEvents: "auto" }}
      >
        <GrPrevious aria-hidden="true" />
      </button>
      <button
        ref={nextButtonRef}
        onClick={handleNext}
        aria-label="다음 이미지"
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 focus:bg-black/80 z-10 cursor-pointer `}
        tabIndex={0}
        type="button"
        onFocus={showControls}
        style={{ pointerEvents: "auto" }}
      >
        <GrNext aria-hidden="true" />
      </button>

      {/* 확장 버튼 */}
      <button
        className={`absolute top-4 py-2 pl-6 z-10 bg-black/60 bg-opacity-50 cursor-pointer hover:bg-black/80 focus:bg-black/80 text-3xl text-white p-2 rounded-r hover:bg-opacity-70 transition-opacity duration-150 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="썸네일 보기"
        aria-expanded={isExpanded}
        aria-controls="thumbnails-panel"
        tabIndex={0}
        onFocus={showControls}
      >
        <PiImages />
      </button>

      {/* 전체화면 버튼 */}
      <button
        className={`absolute top-4 right-4 z-10 bg-black/60 text-3xl text-white p-2 rounded hover:bg-black/80 focus:bg-black/80 transition-opacity duration-150 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "전체화면 종료" : "전체화면으로 보기"}
        tabIndex={0}
        onFocus={showControls}
      >
        {isFullscreen ? (
          <IoContract aria-hidden="true" />
        ) : (
          <IoExpand aria-hidden="true" />
        )}
      </button>

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
      <aside
        id="thumbnails-panel"
        ref={thumbnailPanelRef}
        className={`absolute left-0 top-0 bg-black bg-opacity-80 w-full md:w-1/2 h-full overflow-y-auto z-30 ${
          isExpanded ? "block" : "hidden"
        }`}
        role="dialog"
        aria-label="썸네일 갤러리"
        aria-modal={isExpanded}
      >
        <article className="relative">
          <header className="sticky top-0 pt-4 w-full bg-black p-2">
            <div className="flex w-full justify-between items-center px-3">
              <button
                ref={closeButtonRef}
                onClick={() => setIsExpanded(false)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                aria-label="썸네일 보기 닫기"
                tabIndex={0}
              >
                <VscChromeClose aria-hidden="true" />
              </button>
              <div
                className="bg-black/30 text-white px-3 py-1 rounded-full text-sm cursor-default"
                aria-live="polite"
              >
                {currentIndex + 1} / {totalImagesNumber}
              </div>
            </div>
          </header>

          <main
            className="grid grid-cols-3 gap-2 p-2"
            role="listbox"
            aria-label="이미지 썸네일 목록"
            tabIndex={0}
          >
            {renderThumbnails()}
          </main>
        </article>
      </aside>

      {/* 현재 이미지 번호 */}
      <div
        className={`absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm cursor-default transition-opacity duration-150 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-live="polite"
        role="status"
      >
        {currentIndex + 1} / {totalImagesNumber}
      </div>

      {/* 반투명 오버레이 */}
      {isExpanded && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setIsExpanded(false)}
          role="presentation"
        />
      )}
    </section>
  );
}
