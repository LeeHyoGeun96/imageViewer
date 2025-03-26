export interface ImageData {
  id: number;
  src: string;
  alt: string;
}

export interface ImagesMetadatasResponse {
  images: ImageData[];
}
const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return (
      (response.ok &&
        response.headers.get("Content-Type")?.includes("image/")) ||
      false
    );
  } catch {
    return false;
  }
};

// 이미지 경로 생성 함수
const createImagePath = (index: number, isThumb = false): string => {
  const folder = isThumb ? "carThumbnail" : "carBig";
  const num = (index + 1).toString().padStart(3, "0");
  return `/assets/images/car/${folder}/car_${num}.jpeg`;
};

export const fetchAllImagesMetadatas =
  async (): Promise<ImagesMetadatasResponse> => {
    const images: ImageData[] = [];
    let index = 0;
    let imageExists = true;

    // 이미지가 존재하지 않을 때까지 로드
    while (imageExists) {
      const imagePath = createImagePath(index);
      imageExists = await checkImageExists(imagePath);

      if (imageExists) {
        images.push({
          id: index,
          src: imagePath,
          alt: `자동차 이미지 ${index + 1}`,
        });
        index++;
      }
    }

    return {
      images,
    };
  };

export const fetchAllThumbnailMetadatas =
  async (): Promise<ImagesMetadatasResponse> => {
    const images: ImageData[] = [];
    let index = 0;
    let imageExists = true;

    // 썸네일 이미지가 존재하지 않을 때까지 로드
    while (imageExists) {
      const imagePath = createImagePath(index, true);
      imageExists = await checkImageExists(imagePath);

      if (imageExists) {
        images.push({
          id: index,
          src: imagePath,
          alt: `자동차 이미지 ${index + 1}`,
        });
        index++;
      }
    }

    return {
      images,
    };
  };
