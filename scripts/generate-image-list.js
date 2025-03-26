// scripts/generate-image-list.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname 대체하기 (ES 모듈에는 __dirname이 없음)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이미지가 있는 디렉토리 경로 (public 폴더 기준)
const BIG_IMAGES_DIR = "public/assets/images/car/carBig";
const THUMBNAIL_IMAGES_DIR = "public/assets/images/car/carThumbnail";

// 매니페스트 파일이 저장될 경로
const MANIFEST_PATH = "public/assets/images/manifest.json";

// 프로젝트 루트 경로 구하기
const projectRoot = path.resolve(__dirname, "..");

// 이미지 파일 필터링 함수 (이미지 확장자만 허용)
const isImageFile = (filename) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
};

// 디렉토리에서 이미지 파일 목록 가져오기
function getImagesFromDirectory(dirPath) {
  try {
    const fullPath = path.join(projectRoot, dirPath);

    // 디렉토리가 존재하는지 확인
    if (!fs.existsSync(fullPath)) {
      console.warn(`경고: 디렉토리가 존재하지 않습니다: ${fullPath}`);
      return [];
    }

    // 디렉토리 내용 읽기
    const files = fs.readdirSync(fullPath);

    // 이미지 파일만 필터링하고 정렬
    return files
      .filter(isImageFile)
      .sort((a, b) => {
        // 파일명에서 숫자 추출 (예: car_001.jpeg -> 1)
        const numA = parseInt(a.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/\d+/)?.[0] || "0");
        return numA - numB;
      })
      .map((file, index) => ({
        id: index,
        filename: file,
        src: `/${dirPath.replace("public/", "")}/${file}`,
        alt: `자동차 이미지 ${index + 1}`,
      }));
  } catch (error) {
    console.error(`디렉토리 처리 중 오류 발생: ${dirPath}`, error);
    return [];
  }
}

// 이미지 매니페스트 생성 함수
function generateImageManifest() {
  console.log("이미지 매니페스트 생성 중...");

  // 각 디렉토리에서 이미지 목록 가져오기
  const bigImages = getImagesFromDirectory(BIG_IMAGES_DIR);
  const thumbnails = getImagesFromDirectory(THUMBNAIL_IMAGES_DIR);

  // 매니페스트 객체 생성
  const manifest = {
    bigImages,
    thumbnails,
    lastUpdated: new Date().toISOString(),
    totalCount: {
      big: bigImages.length,
      thumbnail: thumbnails.length,
    },
  };

  // 매니페스트 디렉토리 확인 및 생성
  const manifestDir = path.dirname(path.join(projectRoot, MANIFEST_PATH));
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  // 매니페스트 파일 저장
  fs.writeFileSync(
    path.join(projectRoot, MANIFEST_PATH),
    JSON.stringify(manifest, null, 2)
  );

  console.log(
    `매니페스트 생성 완료: ${bigImages.length}개의 큰 이미지, ${thumbnails.length}개의 썸네일`
  );
  console.log(`매니페스트 저장 위치: ${MANIFEST_PATH}`);
}

// 스크립트 실행
generateImageManifest();
