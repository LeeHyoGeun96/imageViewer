import { createContext } from "react";

// 상태 타입 정의
interface ZoomScreenReaderContextType {
  isZoomed: boolean;
  setIsZoomed: (isZoomed: boolean) => void;
  screenReaderEnabled: boolean;
  setScreenReaderEnabled: (enabled: boolean) => void;
}

// Context 생성
export const ZoomScreenReaderContext = createContext<
  ZoomScreenReaderContextType | undefined
>(undefined);
