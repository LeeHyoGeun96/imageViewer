import { ImageData } from "../../api/imageApi";
import { Skeleton } from "../UI/Skeleton";

interface ThumbnailItemProps {
  index: number;
  currentIndex: number;
  thumbnailData?: ImageData;
  isLoaded: boolean;
  onClick: (index: number) => void;
}

const ThumbnailItem = ({
  index,
  currentIndex,
  thumbnailData,
  isLoaded,
  onClick,
}: ThumbnailItemProps) => {
  return (
    <div
      className={`cursor-pointer p-1 aspect-[4/3] ${
        currentIndex === index ? "border-2 border-blue-500" : ""
      }`}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`이미지 ${index + 1}${
        currentIndex === index ? " (현재 선택됨)" : ""
      }`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(index);
        }
      }}
    >
      {isLoaded && thumbnailData ? (
        <img
          src={thumbnailData.src}
          alt={thumbnailData.alt || `이미지 ${index + 1}`}
          className="w-full h-auto"
        />
      ) : (
        <Skeleton spinnerSize={5} aria-label={`이미지 ${index + 1} 로딩 중`} />
      )}
    </div>
  );
};

export default ThumbnailItem;
