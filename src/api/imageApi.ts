export interface ImageData {
  id: number;
  src: string;
  alt: string;
}

export interface ImagesMetadataResponse {
  totalImages: number;
  images: ImageData[];
}

const TOTAL_IMAGES = 60;

// 이미지 경로 생성 함수
const createImagePath = (index: number, isThumb = false): string => {
  const folder = isThumb ? "carThumbnail" : "carBig";
  const num = (index + 1).toString().padStart(3, "0");
  return `/assets/images/car/${folder}/car_${num}.jpeg`;
};

export const fetchAllImagesMetadata =
  async (): Promise<ImagesMetadataResponse> => {
    const images = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
      id: i,
      src: createImagePath(i, true),
      alt: `자동차 이미지 ${i + 1}`,
    }));

    return {
      totalImages: TOTAL_IMAGES,
      images,
    };
  };

export const fetchAllThumbnailMetadata =
  async (): Promise<ImagesMetadataResponse> => {
    // 전체 이미지 개수
    const images = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
      id: i,
      src: createImagePath(i, true),
      alt: `자동차 이미지 ${i + 1}`,
    }));

    return {
      totalImages: TOTAL_IMAGES,
      images,
    };
  };
