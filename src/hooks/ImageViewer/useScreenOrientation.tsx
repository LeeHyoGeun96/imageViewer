import { useState, useEffect, useCallback } from "react";
import { isMobile } from "react-device-detect";

type OrientationType = "portrait" | "landscape";

interface ScreenOrientationAPI {
  lock: (orientation: string) => Promise<void>;
  unlock: () => void;
  type: string;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

export function useScreenOrientation() {
  const [orientation, setOrientation] = useState<OrientationType>("portrait");
  const [isSupported, setIsSupported] = useState(false);

  // 현재 방향 감지
  useEffect(() => {
    // Screen Orientation API 지원 여부 확인
    if (screen.orientation && isMobile) {
      setIsSupported(true);

      // 초기 방향 설정
      const currentOrientation = screen.orientation.type.includes("portrait")
        ? "portrait"
        : "landscape";
      setOrientation(currentOrientation);

      // 방향 변경 이벤트 리스너
      const handleOrientationChange = () => {
        const newOrientation = screen.orientation.type.includes("portrait")
          ? "portrait"
          : "landscape";
        setOrientation(newOrientation);
      };

      screen.orientation.addEventListener("change", handleOrientationChange);

      return () => {
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        );
      };
    }
  }, []);

  // 방향 전환 함수
  const toggleOrientation = useCallback(async () => {
    if (!isSupported) return;

    try {
      if (orientation === "portrait") {
        // 가로 모드로 전환
        await (screen.orientation as unknown as ScreenOrientationAPI).lock(
          "landscape"
        );
      } else {
        // 세로 모드로 전환
        await (screen.orientation as unknown as ScreenOrientationAPI).lock(
          "portrait"
        );
      }
    } catch (error) {
      console.error("화면 방향을 전환할 수 없습니다:", error);
    }
  }, [orientation, isSupported]);

  // 특정 방향으로 직접 전환
  const lockOrientation = useCallback(
    async (targetOrientation: OrientationType) => {
      if (!isSupported) return false;

      try {
        await (screen.orientation as unknown as ScreenOrientationAPI).lock(
          targetOrientation
        );
        return true;
      } catch (error) {
        console.error(
          `화면 방향을 ${targetOrientation}으로 전환할 수 없습니다:`,
          error
        );
        return false;
      }
    },
    [isSupported]
  );

  // 방향 잠금 해제
  const unlockOrientation = useCallback(() => {
    if (!isSupported) return;

    try {
      screen.orientation.unlock();
    } catch (error) {
      console.error("화면 방향 잠금을 해제할 수 없습니다:", error);
    }
  }, [isSupported]);

  return {
    orientation,
    isSupported,
    toggleOrientation,
    lockOrientation,
    unlockOrientation,
  };
}
