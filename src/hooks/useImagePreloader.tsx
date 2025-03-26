import { useState, useEffect } from "react";
import { ImagesMetadatasResponse } from "../api/imageApi";

export function useImagePreloader(
  currentIndex: number,
  imageMetadatas?: ImagesMetadatasResponse
) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // 이미지 프리로딩
  useEffect(() => {
    // 현재 이미지 및 앞뒤 이미지 프리로딩
    if (!imageMetadatas) return;
    const imagesLength = imageMetadatas.images.length;

    // 앞뒤 두 개씩 프리로딩 (현재 이미지 포함 총 5개)
    const indicesToPreload = [
      // 앞 두 개
      (currentIndex - 2 + imagesLength) % imagesLength,
      (currentIndex - 1 + imagesLength) % imagesLength,
      // 현재 이미지
      currentIndex,
      // 뒤 두 개
      (currentIndex + 1) % imagesLength,
      (currentIndex + 2) % imagesLength,
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
      img.src = imageMetadatas.images[index].src;
    });
  }, [currentIndex, loadedImages, imageMetadatas]);

  return {
    loadedImages,
    isCurrentImageLoaded: loadedImages.has(currentIndex),
  };
}

export default useImagePreloader;
