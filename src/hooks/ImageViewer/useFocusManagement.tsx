import { useEffect, useRef } from "react";

interface UseFocusManagementProps {
  isThumbnailExpanded: boolean;
  focusElementRef: React.RefObject<HTMLElement | null>;
}

export function useFocusManagement({
  isThumbnailExpanded,
  focusElementRef,
}: UseFocusManagementProps) {
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // isThumbnailExpanded 변경 시 포커스 관리
  useEffect(() => {
    // 패널 열릴 때
    if (isThumbnailExpanded) {
      // 현재 포커스 요소 저장
      lastFocusedElementRef.current = document.activeElement as HTMLElement;

      // RAF 사용으로 변경 (더 안정적)
      requestAnimationFrame(() => {
        if (focusElementRef.current) {
          focusElementRef.current.focus();
        }
      });
    }
    // 패널 닫힐 때
    else if (lastFocusedElementRef.current) {
      requestAnimationFrame(() => {
        lastFocusedElementRef.current?.focus();
      });
    }
  }, [isThumbnailExpanded, focusElementRef]);

  return { lastFocusedElement: lastFocusedElementRef.current };
}
