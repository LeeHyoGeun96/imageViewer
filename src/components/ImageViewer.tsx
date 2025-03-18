import { useEffect, useState } from "react";
import TransformViwer from "./reactZoomPanPinch/TransformViwer";

const TOTAL_IMAGES = 60;

export default function ImageViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedIndexes, setPreloadedIndexes] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // 이미지 경로 생성 함수
  const getImagePath = (index: number, isThumb = false): string => {
    const folder = isThumb ? "carThumbnail" : "carBig";
    const num = (index + 1).toString().padStart(3, "0");
    return `/src/assets/images/car/${folder}/car_${num}.jpeg`;
  };

  // 이미지 프리로딩
  useEffect(() => {
    const preloadImage = (index: number) => {
      const img = new Image();
      img.src = getImagePath(index);
      return img;
    };

    // 현재 이미지의 앞뒤 이미지 프리로드
    const prevIndex = (currentIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES;
    const nextIndex = (currentIndex + 1) % TOTAL_IMAGES;

    if (!preloadedIndexes.includes(prevIndex)) {
      preloadImage(prevIndex);
      setPreloadedIndexes((prev) => [...prev, prevIndex]);
    }

    if (!preloadedIndexes.includes(nextIndex)) {
      preloadImage(nextIndex);
      setPreloadedIndexes((prev) => [...prev, nextIndex]);
    }
  }, [currentIndex, preloadedIndexes]);

  // 키보드 이벤트 처리 추가
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyPress);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    // 옵션: 썸네일 선택 후 패널 닫기
    setIsExpanded(false);
  };

  const renderThumbnails = () => {
    return Array.from({ length: TOTAL_IMAGES }).map((_, index) => (
      <div
        key={index}
        className={`thumbnail-item cursor-pointer transition-all p-1 ${
          currentIndex === index ? "border-2 border-blue-500" : ""
        }`}
        onClick={() => handleThumbnailClick(index)}
      >
        <img
          src={getImagePath(index, true)}
          alt={`썸네일 ${index + 1}`}
          className="w-full h-auto"
        />
      </div>
    ));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TOTAL_IMAGES);
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

      {/* 썸네일 패널 - relative 내에서 최상위에 배치 */}
      <div
        className={`absolute left-0 top-0 bg-black bg-opacity-80 w-1/2 h-full overflow-y-auto  z-30 ${
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
      {/* 이전/다음 버튼 - 썸네일 패널이 열렸을 때는 숨김 */}
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
      {/* 반투명 오버레이 - relative 안에서 전체를 덮음 */}
      {isExpanded && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </section>
  );
}
