import { useEffect } from "react";
import { useZoomScreenReaderStore } from "../../store/useZoomScreenReaderStore";

interface TransformViewerShortcutProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
  isCurrentImage: boolean;
  handleKeyboardPanning: (
    direction: "left" | "right" | "up" | "down",
    e: KeyboardEvent
  ) => void;
}

export function useTransformViewerShortcuts({
  zoomIn,
  zoomOut,
  resetTransform,
  isCurrentImage,
  handleKeyboardPanning,
}: TransformViewerShortcutProps) {
  const screenReaderEnabled = useZoomScreenReaderStore(
    (state) => state.screenReaderEnabled
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !isCurrentImage ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // 스크린 리더 모드에 따라 다른 단축키 처리
      if (screenReaderEnabled) {
        // 스크린 리더 모드가 활성화된 경우 Ctrl+Alt 조합 필요
        if (e.key === "+" && e.ctrlKey && e.altKey) {
          zoomIn();
        } else if (e.key === "-" && e.ctrlKey && e.altKey) {
          zoomOut();
        } else if (e.key === "0" && e.ctrlKey && e.altKey) {
          resetTransform();
        } else if (e.key === "ArrowLeft" && e.ctrlKey && e.altKey) {
          handleKeyboardPanning("left", e);
        } else if (e.key === "ArrowRight" && e.ctrlKey && e.altKey) {
          handleKeyboardPanning("right", e);
        } else if (e.key === "ArrowUp" && e.ctrlKey && e.altKey) {
          handleKeyboardPanning("up", e);
        } else if (e.key === "ArrowDown" && e.ctrlKey && e.altKey) {
          handleKeyboardPanning("down", e);
        }
      } else {
        // 일반 모드
        switch (e.key) {
          case "+":
            zoomIn();
            break;
          case "-":
            zoomOut();
            break;
          case "0":
            resetTransform();
            break;
          case "ArrowLeft":
            handleKeyboardPanning("left", e);
            break;
          case "ArrowRight":
            handleKeyboardPanning("right", e);
            break;
          case "ArrowUp":
            handleKeyboardPanning("up", e);
            break;
          case "ArrowDown":
            handleKeyboardPanning("down", e);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    zoomIn,
    zoomOut,
    resetTransform,
    isCurrentImage,
    handleKeyboardPanning,
    screenReaderEnabled,
  ]);
}
