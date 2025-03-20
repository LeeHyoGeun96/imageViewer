import { useEffect, useState, useCallback } from "react";
import TransformViwer from "./reactZoomPanPinch/TransformViwer";
import { ImagesMetadataResponse, ImageData } from "../api/imageApi";
import { Skeleton } from "./UI/Skeleton";

type AspectRatio = "square" | "video" | "portrait" | "cinema" | "auto";

type ResponsiveRatios = {
  sm?: AspectRatio;
  md?: AspectRatio;
  lg?: AspectRatio;
  xl?: AspectRatio;
};

interface ImageViewerProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  thumbnailMetadata?: ImagesMetadataResponse;
  aspectRatio?: AspectRatio;
  responsiveRatios?: ResponsiveRatios;
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
  aspectRatio = "video",
  responsiveRatios = {},
  containerClass = "h-[500px]",
  currentImageSrc = "",
}: ImageViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<
    Map<number, ImageData>
  >(new Map());

  const getAspectClass = (ratio: AspectRatio): string => {
    switch (ratio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      case "cinema":
        return "aspect-[21/9]";
      case "auto":
        return "";
      default:
        return "";
    }
  };

  const getAspectRatioClass = () => {
    // 기본 비율 클래스 획득
    const baseClass = getAspectClass(aspectRatio);

    // 반응형 비율 클래스 획득
    const smClass = responsiveRatios.sm
      ? `sm:${getAspectClass(responsiveRatios.sm)}`
      : "";
    const mdClass = responsiveRatios.md
      ? `md:${getAspectClass(responsiveRatios.md)}`
      : "";
    const lgClass = responsiveRatios.lg
      ? `lg:${getAspectClass(responsiveRatios.lg)}`
      : "";
    const xlClass = responsiveRatios.xl
      ? `xl:${getAspectClass(responsiveRatios.xl)}`
      : "";

    // 모든 클래스 결합
    return [baseClass, smClass, mdClass, lgClass, xlClass]
      .filter(Boolean)
      .join(" ");
  };

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
    <section className="relative rounded-lg overflow-hidden">
      {/* 이미지 크기 유지를 위한 컨테이너 */}
      <div
        className={`w-full bg-gray-100 ${
          aspectRatio === "auto" ? "" : getAspectRatioClass()
        } ${containerClass}`}
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
        className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "닫기" : "썸네일 보기"}
      </button>

      {/* 썸네일 패널 */}
      <div
        className={`absolute left-0 top-0 bg-black bg-opacity-80 w-1/2 h-full overflow-y-auto z-30 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 text-white mb-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(false)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              닫기
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">{renderThumbnails()}</div>
      </div>

      {/* 이전/다음 버튼 */}
      {!isExpanded && (
        <div className="absolute top-1/2 -translate-y-1/2 p-2 w-full flex justify-between">
          <button
            onClick={handlePrev}
            className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
          >
            다음
          </button>
        </div>
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
