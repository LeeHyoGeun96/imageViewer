import { useEffect } from "react";
import { useZoomScreenReader } from "../useZoomScreenReader";

interface UseKeyboardNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
  onEscapeExpanded?: () => void;
  setIsThumbnailExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  isThumbnailExpanded?: boolean;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onPrev,
  onNext,
  onFullscreen,
  onEscapeExpanded,
  setIsThumbnailExpanded,
  isThumbnailExpanded = false,
  enabled = true,
}: UseKeyboardNavigationProps) {
  const { isZoomed } = useZoomScreenReader();
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (isZoomed) return;
        onPrev();
      } else if (e.key === "ArrowRight") {
        if (isZoomed) return;
        onNext();
      } else if (e.key === "f" && onFullscreen) {
        onFullscreen();
      } else if (
        e.key === "Escape" &&
        isThumbnailExpanded &&
        onEscapeExpanded
      ) {
        onEscapeExpanded();
      } else if (e.key === "t" && setIsThumbnailExpanded) {
        setIsThumbnailExpanded((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    onPrev,
    onNext,
    onFullscreen,
    onEscapeExpanded,
    setIsThumbnailExpanded,
    isThumbnailExpanded,
    enabled,
    isZoomed,
  ]);
}
