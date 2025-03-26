import { useState, useEffect } from "react";
import {
  fetchAllThumbnailMetadatas,
  fetchAllImagesMetadatas,
  ImagesMetadatasResponse,
} from "../api/imageApi";

export function useGalleryData() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailMetadatas, setThumbnailMetadatas] =
    useState<ImagesMetadatasResponse>();
  const [imageMetadatas, setImageMetadatas] =
    useState<ImagesMetadatasResponse>();

  // 메타데이터 로딩
  useEffect(() => {
    const getMetaData = async () => {
      const [thumbnailMetadatas, imageMetadatas] = await Promise.all([
        fetchAllThumbnailMetadatas(),
        fetchAllImagesMetadatas(),
      ]);
      setThumbnailMetadatas(thumbnailMetadatas);
      setImageMetadatas(imageMetadatas);
    };
    getMetaData();
  }, []);

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  return {
    currentIndex,
    thumbnailMetadatas,
    imageMetadatas,

    handleIndexChange,
  };
}
