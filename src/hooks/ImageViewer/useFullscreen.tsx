import { useCallback, useEffect, useState, RefObject } from "react";

export function useFullscreen(elementRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 전체화면 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 전체화면 토글 함수
  const toggleFullscreen = useCallback(() => {
    if (!elementRef.current) return;

    if (!document.fullscreenElement) {
      // 전체화면으로 전환
      elementRef.current.requestFullscreen().catch((err) => {
        console.log(`전체화면 전환 불가: ${err.message}`);
      });
    } else {
      // 전체화면 종료
      document.exitFullscreen().catch((err) => {
        console.log(`전체화면 종료 불가: ${err.message}`);
      });
    }
  }, [elementRef]);

  return { isFullscreen, toggleFullscreen };
}
