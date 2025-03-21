import { useEffect, useState, useCallback } from "react";
import TransformViwer from "./reactZoomPanPinch/TransformViwer";
import { ImagesMetadataResponse, ImageData } from "../api/imageApi";
import { Skeleton } from "./UI/Skeleton";
import { GrPrevious, GrNext } from "react-icons/gr";
import { VscChromeClose } from "react-icons/vsc";
import { PiImages } from "react-icons/pi";
interface ImageViewerProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  thumbnailMetadata?: ImagesMetadataResponse;
  containerClass?: string;
  totalImagesNumber: number;
  mainImageIsLoaded?: boolean;
  currentImageSrc?: string;
}

export default function ImageViewer({
  currentIndex,
  totalImagesNumber,
  onIndexChange,
  thumbnailMetadata = { images: [], totalImages: 0 },
  mainImageIsLoaded = false,
  containerClass = "h-[500px]",
  currentImageSrc = "",
}: ImageViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<
    Map<number, ImageData>
  >(new Map());

  const handlePrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + totalImagesNumber) % totalImagesNumber);
  }, [onIndexChange, totalImagesNumber, currentIndex]);

  const handleNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % totalImagesNumber);
  }, [onIndexChange, totalImagesNumber, currentIndex]);

  // 키보드 이벤트 처리 추가
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handlePrev, handleNext]);

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
        >
          {isLoaded && thumbnailData ? (
            // 썸네일이 로드된 경우
            <img
              src={thumbnailData.src}
              alt={thumbnailData.alt}
              className="w-full h-auto"
            />
          ) : (
            // 썸네일이 아직 로드되지 않은 경우
            <Skeleton spinnerSize={10} />
          )}
        </div>
      );
    });
  };

  return (
    <section className="relative rounded-lg overflow-hidden group">
      {/* 이미지 크기 유지를 위한 컨테이너 */}
      <div
        className={`
          aspect-[4/3]
          max-h-[80vh]
          ${containerClass}
        `}
      >
        {mainImageIsLoaded ? (
          <TransformViwer
            imageSrc={currentImageSrc}
            isLoaded={mainImageIsLoaded}
          />
        ) : (
          <Skeleton />
        )}
      </div>
      {/* 확장 버튼 */}
      <button
        className="absolute top-4 py-2  pl-6 z-10 bg-black/60  bg-opacity-50 cursor-pointer hover:bg-black/80 text-3xl text-white p-2 rounded-r hover:bg-opacity-70"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="썸네일 보기"
      >
        <PiImages />
      </button>

      {/* 썸네일 패널 */}
      <aside
        className={`absolute left-0 top-0 bg-black bg-opacity-80 w-full md:w-1/2 h-full overflow-y-auto z-30 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <article className="relative">
          <header className="sticky top-0 pt-4 w-full bg-black p-2">
            <div className="flex w-full justify-between items-center px-3">
              <button
                onClick={() => setIsExpanded(false)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 cursor-pointer"
                aria-label="썸네일 보기 닫기"
              >
                <VscChromeClose />
              </button>
              <div className=" bg-black/30 text-white px-3 py-1 rounded-full text-sm cursor-default">
                {currentIndex + 1} / {totalImagesNumber}
              </div>
            </div>
          </header>

          <main className="grid grid-cols-3 gap-2 p-2">
            {renderThumbnails()}
          </main>
        </article>
      </aside>

      {/* 현재 이미지 번호 */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm cursor-default ">
        {currentIndex + 1} / {totalImagesNumber}
      </div>

      {/* 이전/다음 버튼 */}
      {!isExpanded && (
        <>
          <button
            onClick={handlePrev}
            aria-label="이전 이미지"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <GrPrevious />
          </button>
          <button
            onClick={handleNext}
            aria-label="다음 이미지"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <GrNext />
          </button>
        </>
      )}

      {/* 반투명 오버레이 */}
      {isExpanded && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </section>
  );
}
