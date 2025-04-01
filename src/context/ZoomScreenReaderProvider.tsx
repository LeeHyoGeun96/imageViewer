import { useState, ReactNode, useEffect } from "react";
import { ZoomScreenReaderContext } from "./ZoomScreenReaderContext";

// Provider 컴포넌트
export const ZoomScreenReaderProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // 로컬 스토리지에서 스크린리더 상태 불러와 초기 상태 설정 (오류 처리 추가)
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(() => {
    try {
      const savedScreenReader = localStorage.getItem("screenReaderEnabled");
      // null, undefined, 빈 문자열 체크
      if (
        savedScreenReader === null ||
        savedScreenReader === undefined ||
        savedScreenReader === ""
      ) {
        return false;
      }
      const parsedValue = JSON.parse(savedScreenReader);
      return typeof parsedValue === "boolean" ? parsedValue : false;
    } catch (error) {
      console.error("스크린리더 설정 로드 중 오류 발생:", error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "screenReaderEnabled",
        JSON.stringify(screenReaderEnabled)
      );
    } catch (error) {
      console.error("스크린리더 설정 저장 중 오류 발생:", error);
    }
  }, [screenReaderEnabled]);

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
