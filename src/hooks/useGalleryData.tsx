import { useState, useEffect } from "react";
import {
  fetchAllThumbnailMetadata,
  fetchAllImagesMetadata,
  ImagesMetadataResponse,
} from "../api/imageApi";

export function useGalleryData() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailMetadata, setThumbnailMetadata] =
    useState<ImagesMetadataResponse>();
  const [imageMetadata, setImageMetadata] = useState<ImagesMetadataResponse>();

  // 메타데이터 로딩
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

  const totalImagesNumber = imageMetadata?.totalImages || 0;

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  return {
    currentIndex,
    thumbnailMetadata,
    imageMetadata,
    totalImagesNumber,
    handleIndexChange,
    currentImageMetadata: imageMetadata?.images[currentIndex],
  };
}
