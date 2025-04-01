import { create } from "zustand";

interface ZoomScreenReaderState {
  isZoomed: boolean;
  screenReaderEnabled: boolean;
  setIsZoomed: (value: boolean) => void;
  setScreenReaderEnabled: (value: boolean) => void;
}

export const useZoomScreenReaderStore = create<ZoomScreenReaderState>(
  (set) => ({
    isZoomed: false,
    screenReaderEnabled: false,
    setIsZoomed: (value) => set({ isZoomed: value }),
    setScreenReaderEnabled: (value) => set({ screenReaderEnabled: value }),
  })
);
