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

    // 앞뒤 두 개씩 프리로딩 (현재 이미지 포함 총 5개)
    const indicesToPreload = [
      // 앞 두 개
      (currentIndex - 2 + totalImages) % totalImages,
      (currentIndex - 1 + totalImages) % totalImages,
      // 현재 이미지
      currentIndex,
      // 뒤 두 개
      (currentIndex + 1) % totalImages,
      (currentIndex + 2) % totalImages,
    ];

    // 중복 제거 (이미지 수가 5개 미만인 경우 중복될 수 있음)
    const uniqueIndices = [...new Set(indicesToPreload)];

    uniqueIndices.forEach((index) => {
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

export default useImagePreloader;
