import { useEffect, useState } from "react";
import "./index.css";
import ImageViewer from "./components/ImageViewer";
import {
  fetchAllThumbnailMetadata,
  ImagesMetadataResponse,
  fetchAllImagesMetadata,
} from "./api/imageApi";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailMetadata, setThumbnailMetadata] =
    useState<ImagesMetadataResponse>();
  const [imageMetadata, setImageMetadata] = useState<ImagesMetadataResponse>();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  // 메인 이미지 프리로딩 추가
  useEffect(() => {
    // 현재 이미지 및 앞뒤 이미지 프리로딩
    if (!imageMetadata) return;
    const indicesToPreload = [
      (currentIndex - 1 + imageMetadata.totalImages) %
        imageMetadata.totalImages,
      currentIndex,
      (currentIndex + 1) % imageMetadata.totalImages,
    ];

    indicesToPreload.forEach((index) => {
      // 이미 로드된 이미지는 스킵
      if (loadedImages.has(index)) return;

      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };

      // 프리로딩 시작
      img.src = imageMetadata?.images[index].src;
    });
  }, [currentIndex, loadedImages, imageMetadata]);

  const totalImagesNumber = imageMetadata?.totalImages || 0;

  useEffect(() => {
    const getMetaData = async () => {
      const [thumbnailMetadata, imageMetadata] = await Promise.all([
        fetchAllThumbnailMetadata(),
        fetchAllImagesMetadata(),
      ]);
      setThumbnailMetadata(thumbnailMetadata);
      setImageMetadata(imageMetadata);
    };
    getMetaData();
  }, []);

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <main className="container  flex-col  md:flex-row">
        <section className="md:flex-3">
          <ImageViewer
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            thumbnailMetadata={thumbnailMetadata}
            totalImagesNumber={totalImagesNumber}
            currentImageSrcMetadata={imageMetadata?.images[currentIndex]}
            mainImageIsLoaded={loadedImages.has(currentIndex)}
            containerClass=""
          />
        </section>
        <section className="md:flex-1 bg-gray-100 rounded-lg border-2 border-gray-200 min-h-[500px]"></section>
      </main>
    </>
  );
}

export default App;
