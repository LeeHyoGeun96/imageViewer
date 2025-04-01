import { useState, ReactNode } from "react";
import { ZoomScreenReaderContext } from "./ZoomScreenReaderContext";

// Provider 컴포넌트
export const ZoomScreenReaderProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false); // 기본적으로 스크린 리더 비활성화

  return (
    <ZoomScreenReaderContext.Provider
      value={{
        isZoomed,
        setIsZoomed,
        screenReaderEnabled,
        setScreenReaderEnabled,
      }}
    >
      {children}
    </ZoomScreenReaderContext.Provider>
  );
};
