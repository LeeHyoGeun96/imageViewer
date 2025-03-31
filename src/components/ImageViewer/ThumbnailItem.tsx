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
    <li>
      <button
        className={`cursor-pointer p-1 aspect-[4/3] ${
          currentIndex === index ? "border-2 border-blue-500" : ""
        }`}
        onClick={() => onClick(index)}
        aria-label={`${index + 1}번째 이미지${
          currentIndex === index ? " (현재 선택됨)" : ""
        }`}
        aria-hidden={currentIndex === index ? "false" : "true"}
        type="button"
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
            aria-hidden="true"
            className="w-full h-auto"
          />
        ) : (
          <Skeleton spinnerSize={8} aria-hidden="true" />
        )}
      </button>
    </li>
  );
};

export default ThumbnailItem;
