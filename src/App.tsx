import { useCallback, useEffect, useState } from "react";
import "./App.css";
import ImageViewer from "./components/ImageViewer";

const TOTAL_IMAGES = 60;

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedIndexes, setPreloadedIndexes] = useState<number[]>([]);
  const [loadedThumbnails, setLoadedThumbnails] = useState<number[]>([]);

  const getImagePath = useCallback((index: number, isThumb = false): string => {
    const folder = isThumb ? "carThumbnail" : "carBig";
    const num = (index + 1).toString().padStart(3, "0");
    return `/src/assets/images/car/${folder}/car_${num}.jpeg`;
  }, []);

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
  }, [currentIndex, preloadedIndexes, getImagePath]);

  // 이미지 경로 생성 함수

  // 메인 이미지 렌더링 후 썸네일 이미지 로드 시작
  useEffect(() => {
    // 처음 한 번만 실행되도록 설정
    const loadThumbnails = async () => {
      // 모든 썸네일 이미지 순차적으로 로드
      for (let i = 0; i < TOTAL_IMAGES; i++) {
        // 현재 상태 직접 확인 (ref 사용 안 함)
        const img = new Image();
        img.src = getImagePath(i, true);

        // 이미지 로드 완료 시 상태 업데이트
        img.onload = () => {
          setLoadedThumbnails((prev) => {
            // 이미 로드된 경우 추가하지 않음
            if (prev.includes(i)) return prev;
            return [...prev, i];
          });
        };

        // 더 긴 지연으로 확인 가능하게
        if (i % 5 === 4) {
          await new Promise((r) => setTimeout(r, 50));
        }
      }
    };

    loadThumbnails();
  }, [getImagePath]);

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };
  return (
    <>
      <main>
        <section>
          <ImageViewer
            currentIndex={currentIndex}
            totalImages={TOTAL_IMAGES}
            onIndexChange={handleIndexChange}
            getImagePath={getImagePath}
            loadedThumbnails={loadedThumbnails}
          />
        </section>
        <section>
          <div className="border-1 border-red-500">fsefes</div>
        </section>
      </main>
    </>
  );
}

export default App;
