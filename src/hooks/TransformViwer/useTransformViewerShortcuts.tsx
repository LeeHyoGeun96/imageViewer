// src/hooks/useTransformViewerShortcuts.tsx
import { useEffect } from "react";

interface TransformViewerShortcutProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
  isCurrentImage: boolean;
}

export function useTransformViewerShortcuts({
  zoomIn,
  zoomOut,
  resetTransform,
  isCurrentImage,
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIn, zoomOut, resetTransform, isCurrentImage]);
}
