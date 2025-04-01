import { useCallback, useEffect, useRef, useState } from "react";
import { useZoomScreenReaderStore } from "../../store/useZoomScreenReaderStore";

function useSwipeMessage() {
  const [showMessage, setShowMessage] = useState(false);
  const messageTimerRef = useRef<number | null>(null);
  const lastMessageTimeRef = useRef<number>(0);
  const isZoomed = useZoomScreenReaderStore((state) => state.isZoomed);

  const showSwipeMessage = useCallback(() => {
    if (!isZoomed) return;

    const now = Date.now();
    if (now - lastMessageTimeRef.current > 500) {
      setShowMessage(true);
      lastMessageTimeRef.current = now;

      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }

      messageTimerRef.current = window.setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
  }, [isZoomed]);

  // 클린업 로직
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  return { showMessage, showSwipeMessage };
}

export default useSwipeMessage;
