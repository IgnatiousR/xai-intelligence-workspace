"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Observes an element and returns a ref indicating if it is currently intersecting the viewport.
 * Avoids React state to prevent re-renders when used in animation frames.
 */
export function useVisibilityObserver(ref: RefObject<HTMLElement | null>) {
  const visible = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}
