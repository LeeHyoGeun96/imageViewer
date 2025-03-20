import { useCallback, useEffect, useState } from "react";
import "./index.css";
import ImageViewer from "./components/ImageViewer";
import {
  fetchAllThumbnailMetadata,
  ImagesMetadataResponse,
} from "./api/imageApi";

const TOTAL_IMAGES = 60;
function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailMetadata, setThumbnailMetadata] =
    useState<ImagesMetadataResponse>();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const getImagePath = useCallback((index: number, isThumb = false): string => {
    const folder = isThumb ? "carThumbnail" : "carBig";
    const num = (index + 1).toString().padStart(3, "0");
    return `/src/assets/images/car/${folder}/car_${num}.jpeg`;
  }, []);

  useEffect(() => {
    const fetchThumbnailMetadata = async () => {
      const metadata = await fetchAllThumbnailMetadata();
      setThumbnailMetadata(metadata);
    };
    fetchThumbnailMetadata();
  }, []);

  // 메인 이미지 렌더링 후 썸네일 이미지 로드 시작

  useEffect(() => {
    const preloadAdjacentImages = () => {
      // 현재 이미지 인덱스 기준 앞뒤 2개씩 프리로딩
      const indicesToPreload = [
        (currentIndex - 2 + TOTAL_IMAGES) % TOTAL_IMAGES,
        (currentIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES,
        currentIndex,
        (currentIndex + 1) % TOTAL_IMAGES,
        (currentIndex + 2) % TOTAL_IMAGES,
      ];

      // 중복 제거 후 처리
      [...new Set(indicesToPreload)].forEach((index) => {
        const imagePath = getImagePath(index);

        // 이미 로드된 이미지는 다시 로드하지 않음
        if (loadedImages.has(imagePath)) return;

        const img = new Image();

        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(imagePath));
        };

        // 프리로딩 시작
        img.src = imagePath;
      });
    };

    preloadAdjacentImages();
  }, [currentIndex, getImagePath, loadedImages]);

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <main className="container  flex-col  md:flex-row">
        <section className="md:flex-3">
          <ImageViewer
            currentIndex={currentIndex}
            totalImages={TOTAL_IMAGES}
            onIndexChange={handleIndexChange}
            getImagePath={getImagePath}
            thumbnailMetadata={thumbnailMetadata}
            isLoaded={loadedImages.has(getImagePath(currentIndex))}
            aspectRatio="video"
            containerClass=""
          />
        </section>
        <section className="md:flex-1 bg-blue-500 min-h-[500px]"></section>
      </main>
    </>
  );
}

export default App;
