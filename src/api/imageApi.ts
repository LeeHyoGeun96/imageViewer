export interface ImageData {
  id: number;
  src: string;
  alt: string;
}

export interface ImagesMetadatasResponse {
  images: ImageData[];
}

// 매니페스트 인터페이스 정의
interface ImageManifest {
  bigImages: {
    id: number;
    filename: string;
    src: string;
    alt: string;
  }[];
  thumbnails: {
    id: number;
    filename: string;
    src: string;
    alt: string;
  }[];
  lastUpdated: string;
  totalCount: {
    big: number;
    thumbnail: number;
  };
}

// 매니페스트 파일 가져오기
const fetchImageManifest = async (): Promise<ImageManifest> => {
  try {
    const response = await fetch("/assets/images/manifest.json");
    if (!response.ok) {
      throw new Error(
        `매니페스트 파일을 불러올 수 없습니다: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("이미지 매니페스트 로딩 실패:", error);
    // 기본 매니페스트 반환 (빈 배열)
    return {
      bigImages: [],
      thumbnails: [],
      lastUpdated: new Date().toISOString(),
      totalCount: { big: 0, thumbnail: 0 },
    };
  }
};

// 큰 이미지 메타데이터 가져오기
export const fetchAllImagesMetadatas =
  async (): Promise<ImagesMetadatasResponse> => {
    const manifest = await fetchImageManifest();
    return {
      images: manifest.bigImages.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
      })),
    };
  };

// 썸네일 이미지 메타데이터 가져오기
export const fetchAllThumbnailMetadatas =
  async (): Promise<ImagesMetadatasResponse> => {
    const manifest = await fetchImageManifest();
    return {
      images: manifest.thumbnails.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
      })),
    };
  };
