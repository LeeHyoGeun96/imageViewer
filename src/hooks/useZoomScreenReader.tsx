import { ZoomScreenReaderContext } from "../context/ZoomScreenReaderContext";
import { useContext } from "react";

export const useZoomScreenReader = () => {
  const context = useContext(ZoomScreenReaderContext);
  if (!context) {
    throw new Error(
      "useZoomScreenReader must be used within a ZoomScreenReaderProvider"
    );
  }
  return context;
};
