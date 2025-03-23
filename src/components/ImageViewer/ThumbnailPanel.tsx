import React, { useRef, useEffect } from "react";
import { ImageData } from "../../api/imageApi";
import { VscChromeClose } from "react-icons/vsc";
import ThumbnailItem from "./ThumbnailItem";

interface ThumbnailPanelProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  currentIndex: number;
  totalImagesNumber: number;
  loadedThumbnails: Map<number, ImageData>;
  onThumbnailClick: (index: number) => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const ThumbnailPanel = ({
  isExpanded,
  setIsExpanded,
  currentIndex,
  totalImagesNumber,
  loadedThumbnails,
  onThumbnailClick,
  closeButtonRef,
}: ThumbnailPanelProps) => {
  const thumbnailPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isExpanded) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !thumbnailPanelRef.current) return;

      const focusableElements = thumbnailPanelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isExpanded]);

  return (
    <>
      <section
        id="thumbnails-panel"
        ref={thumbnailPanelRef}
        className={`absolute left-0 top-0 bg-black bg-opacity-80 w-full md:w-1/2 h-full overflow-y-auto z-30 ${
          isExpanded ? "block" : "hidden"
        }`}
        role="dialog"
        aria-label="썸네일 갤러리"
        aria-modal={isExpanded}
        aria-hidden={!isExpanded}
      >
        <div className="relative">
          <header className="sticky top-0 pt-4 w-full bg-black p-2">
            <div className="flex w-full justify-between items-center px-3">
              <button
                ref={closeButtonRef}
                onClick={() => setIsExpanded(false)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                aria-label="썸네일 보기 닫기"
                tabIndex={0}
              >
                <VscChromeClose aria-hidden="true" />
              </button>
              <div
                className="bg-black/30 text-white px-3 py-1 rounded-full text-sm cursor-default"
                aria-live="polite"
              >
                {currentIndex + 1} / {totalImagesNumber}
              </div>
            </div>
          </header>

          <ul
            className="grid grid-cols-3 gap-2 p-2"
            role="listbox"
            aria-label="이미지 썸네일 목록"
            tabIndex={0}
          >
            {Array.from({ length: totalImagesNumber }).map((_, index) => {
              const isLoaded = loadedThumbnails.has(index);
              const thumbnailData = loadedThumbnails.get(index);

              return (
                <ThumbnailItem
                  key={index}
                  index={index}
                  currentIndex={currentIndex}
                  thumbnailData={thumbnailData}
                  isLoaded={isLoaded}
                  onClick={onThumbnailClick}
                />
              );
            })}
          </ul>
        </div>
      </section>

      {isExpanded && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setIsExpanded(false)}
          role="presentation"
        />
      )}
    </>
  );
};

export default ThumbnailPanel;
