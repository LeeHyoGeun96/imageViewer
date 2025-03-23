import React from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { PiImages } from "react-icons/pi";
import { IoExpand, IoContract } from "react-icons/io5";

interface NavigationControlsProps {
  handlePrev: () => void;
  handleNext: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isExpanded: boolean;
  currentIndex: number;
  totalImagesNumber: number;
  prevButtonRef: React.RefObject<HTMLButtonElement | null>;
  nextButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const NavigationControls = ({
  handlePrev,
  handleNext,
  toggleFullscreen,
  isFullscreen,
  setIsExpanded,
  isExpanded,
  currentIndex,
  totalImagesNumber,
  prevButtonRef,
  nextButtonRef,
}: NavigationControlsProps) => {
  return (
    <>
      <button
        ref={prevButtonRef}
        onClick={handlePrev}
        aria-label="이전 이미지"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 focus:bg-black/80 z-10 cursor-pointer control-visibility"
        tabIndex={0}
        type="button"
        style={{ pointerEvents: "auto" }}
      >
        <GrPrevious aria-hidden="true" />
      </button>
      <button
        ref={nextButtonRef}
        onClick={handleNext}
        aria-label="다음 이미지"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-5 rounded-2xl hover:bg-black/80 focus:bg-black/80 z-10 cursor-pointer control-visibility"
        tabIndex={0}
        type="button"
        style={{ pointerEvents: "auto" }}
      >
        <GrNext aria-hidden="true" />
      </button>

      <button
        className="absolute top-4 py-2 pl-6 z-10 bg-black/60 bg-opacity-50 cursor-pointer hover:bg-black/80 focus:bg-black/80 text-3xl text-white p-2 rounded-r hover:bg-opacity-70 control-visibility"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="썸네일 보기"
        aria-expanded={isExpanded}
        aria-controls="thumbnails-panel"
        tabIndex={0}
      >
        <PiImages aria-hidden="true" />
      </button>

      <button
        className="absolute top-4 right-4 z-10 bg-black/60 text-3xl text-white p-2 rounded hover:bg-black/80 focus:bg-black/80 control-visibility"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "전체화면 종료" : "전체화면으로 보기"}
        tabIndex={0}
      >
        {isFullscreen ? (
          <IoContract aria-hidden="true" />
        ) : (
          <IoExpand aria-hidden="true" />
        )}
      </button>

      <div
        className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm cursor-default control-visibility"
        aria-live="polite"
        role="status"
      >
        {currentIndex + 1} / {totalImagesNumber}
      </div>
    </>
  );
};

export default NavigationControls;
