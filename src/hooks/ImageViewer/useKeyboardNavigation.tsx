import { useZoomScreenReaderStore } from "../../store/useZoomScreenReaderStore";
import { useEffect } from "react";

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
  const isZoomed = useZoomScreenReaderStore((state) => state.isZoomed);
  const screenReaderEnabled = useZoomScreenReaderStore(
    (state) => state.screenReaderEnabled
  );
  const setScreenReaderEnabled = useZoomScreenReaderStore(
    (state) => state.setScreenReaderEnabled
  );
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // 스크린 리더 모드 토글 단축키는 항상 동일
      if (e.key === "s" && e.ctrlKey && e.altKey) {
        setScreenReaderEnabled(!screenReaderEnabled);
      }

      // 스크린 리더 모드에 따라 다른 단축키 처리
      if (screenReaderEnabled) {
        // 스크린 리더 모드가 활성화된 경우 Ctrl+Alt 조합 필요
        if (e.key === "ArrowLeft" && e.ctrlKey && e.altKey && !isZoomed) {
          onPrev();
        } else if (
          e.key === "ArrowRight" &&
          e.ctrlKey &&
          e.altKey &&
          !isZoomed
        ) {
          onNext();
        } else if (e.key === "f" && e.ctrlKey && e.altKey && onFullscreen) {
          onFullscreen();
        } else if (
          e.key === "Escape" &&
          e.ctrlKey &&
          e.altKey &&
          isThumbnailExpanded &&
          onEscapeExpanded
        ) {
          onEscapeExpanded();
        } else if (
          e.key === "t" &&
          e.ctrlKey &&
          e.altKey &&
          setIsThumbnailExpanded
        ) {
          setIsThumbnailExpanded((prev) => !prev);
        }
      } else {
        // 일반 모드
        if (e.key === "ArrowLeft" && !isZoomed) {
          onPrev();
        } else if (e.key === "ArrowRight" && !isZoomed) {
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
    screenReaderEnabled,
    setScreenReaderEnabled,
  ]);
}
