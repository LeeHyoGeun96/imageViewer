import { useState, useEffect } from "react";
import { ImagesMetadataResponse, ImageData } from "../api/imageApi";

export function useThumbnailLoader(thumbnailMetadata?: ImagesMetadataResponse) {
  const [loadedThumbnails, setLoadedThumbnails] = useState<
    Map<number, ImageData>
  >(new Map());

  // 썸네일 이미지 로드
  useEffect(() => {
    if (!thumbnailMetadata || thumbnailMetadata.images.length === 0) return;
    const totalImages = thumbnailMetadata.images.length;

    // 배치 크기 설정 - 5개씩 로드
    const BATCH_SIZE = 5;

    const loadThumbnails = async () => {
      for (
        let batchStart = 0;
        batchStart < totalImages;
        batchStart += BATCH_SIZE
      ) {
        // 현재 배치의 끝 인덱스 계산 (totalImages를 초과하지 않도록)
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalImages);

        // 현재 배치의 이미지들을 로드
        for (let i = batchStart; i < batchEnd; i++) {
          const thumbData = thumbnailMetadata.images[i];
          if (!thumbData) continue;

          const img = new Image();

          img.onload = () => {
            setLoadedThumbnails((prev) => {
              const newMap = new Map(prev);
              newMap.set(thumbData.id, thumbData);
              return newMap;
            });
          };

          // 로드 시작
          img.src = thumbData.src;
        }

        // 한 배치 로드 후 지연 - 다음 배치 로드 전에 약간의 지연을 줌
        if (batchEnd < totalImages) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    };

    loadThumbnails();
  }, [thumbnailMetadata]);

  return { loadedThumbnails };
}
