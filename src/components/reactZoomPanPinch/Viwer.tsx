import { useState, useEffect } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import "./Viewer.css";

// 이미지 총 개수 (파일명으로 확인)
const TOTAL_IMAGES = 60;

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="zoom-tools">
      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => resetTransform()}>x</button>
    </div>
  );
};

const Viewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedIndexes, setPreloadedIndexes] = useState<number[]>([]);

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TOTAL_IMAGES);
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="viewer-container">
      <button className="nav-button prev" onClick={handlePrev}>
        이전
      </button>

      <div className="image-container">
        <TransformWrapper
          initialScale={1}
          initialPositionX={200}
          initialPositionY={100}
          wheel={{ step: 100 }}
          key={currentIndex} // 이미지 변경 시 Transform 상태 초기화
        >
          {() => (
            <>
              <ZoomControls />
              <TransformComponent>
                <img
                  src={getImagePath(currentIndex)}
                  alt={`이미지 ${currentIndex + 1}`}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <button className="nav-button next" onClick={handleNext}>
        다음
      </button>

      {/* 현재 이미지 번호 표시 */}
      <div className="image-counter">
        {currentIndex + 1} / {TOTAL_IMAGES}
      </div>

      {/* 썸네일 미리보기 */}
      <div className="thumbnail-preview">
        <img src={getImagePath(currentIndex, true)} alt="썸네일" />
      </div>
    </div>
  );
};

export default Viewer;
