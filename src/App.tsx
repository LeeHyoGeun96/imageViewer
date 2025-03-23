import "./index.css";
import ImageViewer from "./components/ImageViewer";
import { useGalleryData } from "./hooks/useGalleryData";
import { useImagePreloader } from "./hooks/useImagePreloader";

function App() {
  // 갤러리 데이터 관리
  const {
    currentIndex,
    thumbnailMetadata,
    imageMetadata,
    totalImagesNumber,
    handleIndexChange,
    currentImageMetadata,
  } = useGalleryData();

  // 이미지 프리로딩
  const { isCurrentImageLoaded } = useImagePreloader(
    currentIndex,
    imageMetadata
  );

  return (
    <>
      <main className="my-container flex flex-col md:flex-row gap-4">
        <section className="flex-3 overflow-hidden">
          <ImageViewer
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            thumbnailMetadata={thumbnailMetadata}
            totalImagesNumber={totalImagesNumber}
            currentImageSrcMetadata={currentImageMetadata}
            imageMetadatas={imageMetadata?.images}
            mainImageIsLoaded={isCurrentImageLoaded}
            containerClass=""
          />
        </section>
        <section className="md:flex-1 bg-gray-100 rounded-lg border-2 border-gray-200 min-h-[500px]"></section>
      </main>
    </>
  );
}

export default App;
