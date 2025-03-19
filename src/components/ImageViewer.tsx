import { useEffect, useState, useCallback } from "react";
import TransformViwer from "./reactZoomPanPinch/TransformViwer";

interface ImageViewerProps {
  currentIndex: number;
  totalImages: number;
  onIndexChange: (index: number) => void;
  getImagePath: (index: number, isThumb?: boolean) => string;
  loadedThumbnails: number[];
}

export default function ImageViewer({
  currentIndex,
  totalImages,
  onIndexChange,
  getImagePath,
  loadedThumbnails,
}: ImageViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + totalImages) % totalImages);
  }, [onIndexChange, totalImages, currentIndex]);

  const handleNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % totalImages);
  }, [onIndexChange, totalImages, currentIndex]);

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

  const handleThumbnailClick = (index: number) => {
    onIndexChange(index);
    setIsExpanded(false);
  };

  const renderThumbnails = () => {
    return Array.from({ length: totalImages }).map((_, index) => (
      <div
        key={index}
        className={`thumbnail-item cursor-pointer transition-all p-1 ${
          currentIndex === index ? "border-2 border-blue-500" : ""
        }`}
        onClick={() => handleThumbnailClick(index)}
      >
        {loadedThumbnails.includes(index) ? (
          // 썸네일이 로드된 경우
          <img
            src={getImagePath(index, true)}
            alt={`썸네일 ${index + 1}`}
            className="w-full h-auto"
          />
        ) : (
          // 썸네일이 아직 로드되지 않은 경우
          <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">로딩 중...</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <section className="relative rounded-lg overflow-hidden">
      <div>
        <TransformViwer imageSrc={getImagePath(currentIndex)} />
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
