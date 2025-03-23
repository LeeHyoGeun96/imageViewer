import { useEffect, useRef } from "react";

interface UseFocusManagementProps {
  isExpanded: boolean;
  focusElementRef: React.RefObject<HTMLElement | null>;
}

export function useFocusManagement({
  isExpanded,
  focusElementRef,
}: UseFocusManagementProps) {
  const lastFocusedElementRef = useRef<HTMLElement>(null);

  // 포커스 관리
  useEffect(() => {
    if (isExpanded) {
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
  }, [isExpanded, focusElementRef]);

  return { lastFocusedElement: lastFocusedElementRef.current };
}
