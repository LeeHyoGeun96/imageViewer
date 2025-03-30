// src/hooks/useTransformViewerShortcuts.tsx
import { useEffect } from "react";

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !isCurrentImage ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "+":
        case "=":
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIn, zoomOut, resetTransform, isCurrentImage, handleKeyboardPanning]);
}
