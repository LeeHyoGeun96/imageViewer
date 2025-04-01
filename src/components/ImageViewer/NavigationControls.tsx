import { memo } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { PiImages } from "react-icons/pi";
import { IoExpand, IoContract } from "react-icons/io5";
import RotateIconSVG from "../../assets/rotatePhone.svg?react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useZoomScreenReader } from "../../hooks/useZoomScreenReader";

interface NavigationControlsProps {
  onNext: () => void;
  onPrev: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  setIsThumbnailExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isThumbnailExpanded: boolean;
  currentIndex: number;
  totalImagesNumber?: number;
  totalThumbnailsNumber?: number;
  toggleOrientation?: () => void; // 선택적 - API가 지원되지 않을 경우 undefined
  orientation: OrientationType;
  isOrientationSupported: boolean;
}

type OrientationType = "portrait" | "landscape";

const NavigationControls = ({
  toggleFullscreen,
  isFullscreen,
  setIsThumbnailExpanded,
  isThumbnailExpanded,
  currentIndex,
  totalImagesNumber,
  totalThumbnailsNumber,
  onNext,
  onPrev,
  toggleOrientation,
  orientation,
  isOrientationSupported,
}: NavigationControlsProps) => {
  const { screenReaderEnabled } = useZoomScreenReader();

  const handlePrev = () => {
    onPrev();
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 focus:bg-black/80 z-10 cursor-pointer "
            type="button"
            style={{ pointerEvents: "auto" }}
            aria-label={
              screenReaderEnabled
                ? "이전 이미지(Ctrl+Alt+왼쪽 화살표)"
                : "이전 이미지(왼쪽 화살표)"
            }
          >
            <GrPrevious aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {screenReaderEnabled
              ? "이전 이미지(Ctrl+Alt+왼쪽 화살표)"
              : "이전 이미지(왼쪽 화살표)"}
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 focus:bg-black/80 z-10 cursor-pointer"
            type="button"
            style={{ pointerEvents: "auto" }}
            aria-label={
              screenReaderEnabled
                ? "다음 이미지(Ctrl+Alt+오른쪽 화살표)"
                : "다음 이미지(오른쪽 화살표)"
            }
          >
            <GrNext aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {screenReaderEnabled
              ? "다음 이미지(Ctrl+Alt+오른쪽 화살표)"
              : "다음 이미지(오른쪽 화살표)"}
          </p>
        </TooltipContent>
      </Tooltip>

      {!!totalThumbnailsNumber && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="absolute top-4 py-2 pl-6 z-10 bg-black/60 bg-opacity-50 cursor-pointer hover:bg-black/80 focus:bg-black/80 text-3xl text-white p-2 rounded-r hover:bg-opacity-70"
              onClick={() => setIsThumbnailExpanded(!isThumbnailExpanded)}
              aria-expanded={isThumbnailExpanded}
              type="button"
              aria-label={
                screenReaderEnabled
                  ? "썸네일 보기(Ctrl+Alt+t)"
                  : "썸네일 보기(t)"
              }
            >
              <PiImages aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {screenReaderEnabled
                ? "썸네일 보기(Ctrl+Alt+t)"
                : "썸네일 보기(t)"}
            </p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* 화면 방향 전환 버튼 (전체화면 모드이고 API가 지원될 때만 표시) */}
      {isFullscreen && isOrientationSupported && toggleOrientation && (
        <button
          className="absolute top-4 right-16 z-10 bg-black/60 text-3xl text-white p-2 rounded hover:bg-black/80 focus:bg-black/80 "
          type="button"
          onClick={toggleOrientation}
          aria-label={
            orientation === "portrait" ? "가로 모드로 전환" : "세로 모드로 전환"
          }
        >
          <RotateIconSVG className="size-7" aria-hidden="true" />
        </button>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="absolute top-4 right-4 z-10 bg-black/60 text-3xl text-white p-2 rounded hover:bg-black/80 focus:bg-black/80"
            onClick={toggleFullscreen}
            type="button"
            aria-label={
              isFullscreen
                ? screenReaderEnabled
                  ? "전체화면 종료(Ctrl+Alt+f)"
                  : "전체화면 종료(f)"
                : screenReaderEnabled
                ? "전체화면으로 보기(Ctrl+Alt+f)"
                : "전체화면으로 보기(f)"
            }
          >
            {isFullscreen ? (
              <IoContract aria-hidden="true" />
            ) : (
              <IoExpand aria-hidden="true" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isFullscreen
              ? screenReaderEnabled
                ? "전체화면 종료(Ctrl+Alt+f)"
                : "전체화면 종료(f)"
              : screenReaderEnabled
              ? "전체화면으로 보기(Ctrl+Alt+f)"
              : "전체화면으로 보기(f)"}
          </p>
        </TooltipContent>
      </Tooltip>

      {totalImagesNumber && (
        <div
          className="absolute z-20 bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm cursor-default "
          role="status"
        >
          {currentIndex + 1} / {totalImagesNumber}
        </div>
      )}
    </TooltipProvider>
  );
};

// memo로 감싸서 내보내기
export default memo(NavigationControls);
