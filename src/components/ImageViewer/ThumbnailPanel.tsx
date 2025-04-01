import React, { useRef, useEffect } from "react";
import { ImageData } from "../../api/imageApi";
import { VscChromeClose } from "react-icons/vsc";
import ThumbnailItem from "./ThumbnailItem";

interface ThumbnailPanelProps {
  isThumbnailExpanded: boolean;
  setIsThumbnailExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  currentIndex: number;
  totalImagesNumber?: number;
  loadedThumbnails: Map<number, ImageData>;
  onThumbnailClick: (index: number) => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const ThumbnailPanel = ({
  isThumbnailExpanded,
  setIsThumbnailExpanded,
  currentIndex,
  totalImagesNumber,
  loadedThumbnails,
  onThumbnailClick,
  closeButtonRef,
}: ThumbnailPanelProps) => {
  const thumbnailPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, [isThumbnailExpanded]);

  if (!isThumbnailExpanded || !totalImagesNumber) return;

  return (
    <>
      <section
        ref={thumbnailPanelRef}
        className={`absolute left-0 top-0 bg-black bg-opacity-80 w-full md:w-1/2 h-full overflow-y-auto z-30 ${
          isThumbnailExpanded ? "block" : "hidden"
        }`}
        aria-modal={isThumbnailExpanded}
        aria-label="썸네일 갤러리"
      >
        <div className="relative">
          <header className="sticky top-0 pt-4 w-full bg-black p-2">
            <div className="flex w-full justify-between items-center px-3">
              <button
                ref={closeButtonRef}
                onClick={() => setIsThumbnailExpanded(false)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                aria-label="닫기"
              >
                <VscChromeClose aria-hidden="true" />
              </button>
              {totalImagesNumber && (
                <div
                  className="bg-black/30 text-white px-3 py-1 rounded-full text-sm cursor-default"
                  aria-hidden="true"
                >
                  {currentIndex + 1} / {totalImagesNumber}
                </div>
              )}
            </div>
          </header>

          <ul className="grid grid-cols-3 gap-2 p-2" tabIndex={0}>
            {Array.from({ length: totalImagesNumber ?? 0 }).map((_, index) => {
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

      {isThumbnailExpanded && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setIsThumbnailExpanded(false)}
          role="presentation"
        />
      )}
    </>
  );
};

export default ThumbnailPanel;
