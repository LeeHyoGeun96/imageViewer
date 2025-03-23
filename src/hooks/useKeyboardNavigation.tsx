import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
  onEscapeExpanded?: () => void;
  isExpanded?: boolean;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onPrev,
  onNext,
  onFullscreen,
  onEscapeExpanded,
  isExpanded = false,
  enabled = true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "f" && onFullscreen) {
        onFullscreen();
      } else if (e.key === "Escape" && isExpanded && onEscapeExpanded) {
        onEscapeExpanded();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onPrev, onNext, onFullscreen, onEscapeExpanded, isExpanded, enabled]);
}
