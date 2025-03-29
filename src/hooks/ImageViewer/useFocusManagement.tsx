import { useEffect, useRef } from "react";

interface UseFocusManagementProps {
  isThumbnailExpanded: boolean;
  focusElementRef: React.RefObject<HTMLElement | null>;
}

export function useFocusManagement({
  isThumbnailExpanded,
  focusElementRef,
}: UseFocusManagementProps) {
  const lastFocusedElementRef = useRef<HTMLElement>(null);

  // 포커스 관리
  useEffect(() => {
    if (isThumbnailExpanded) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        if (focusElementRef.current) {
          focusElementRef.current.focus();
        }
      }, 100);
    } else {
      setTimeout(() => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus();
        }
      }, 100);
    }
  }, [isThumbnailExpanded, focusElementRef]);

  return { lastFocusedElement: lastFocusedElementRef.current };
}
