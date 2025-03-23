import { useState, useEffect } from "react";
import { ImagesMetadataResponse } from "../api/imageApi";

export function useImagePreloader(
  currentIndex: number,
  imageMetadata?: ImagesMetadataResponse
) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // 이미지 프리로딩
  useEffect(() => {
    // 현재 이미지 및 앞뒤 이미지 프리로딩
    if (!imageMetadata) return;
    const totalImages = imageMetadata.totalImages;

    const indicesToPreload = [
      (currentIndex - 1 + totalImages) % totalImages,
      currentIndex,
      (currentIndex + 1) % totalImages,
    ];

    indicesToPreload.forEach((index) => {
      // 이미 로드된 이미지는 스킵
      if (loadedImages.has(index)) return;

      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };

      // 프리로딩 시작
      img.src = imageMetadata.images[index].src;
    });
  }, [currentIndex, loadedImages, imageMetadata]);

  return {
    loadedImages,
    isCurrentImageLoaded: loadedImages.has(currentIndex),
  };
}
