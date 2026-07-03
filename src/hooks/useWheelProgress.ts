"use client";

import { useRef, useEffect, type RefObject } from "react";

interface UseWheelProgressOptions {
  speed?: number;
}

export function useWheelProgress(
  containerRef: RefObject<HTMLElement | null>,
  options?: UseWheelProgressOptions
) {
  const progress = useRef(0);
  const speed = options?.speed ?? 0.001;
  const touchStartY = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isInside = (x: number, y: number) => {
      const rect = el.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    const onWheel = (e: WheelEvent) => {
      if (!isInside(e.clientX, e.clientY)) return;
      e.preventDefault();
      progress.current = Math.max(
        0,
        Math.min(1, progress.current + e.deltaY * speed)
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isInside(e.touches[0].clientX, e.touches[0].clientY)) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isInside(e.touches[0].clientX, e.touches[0].clientY)) return;
      e.preventDefault();
      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      progress.current = Math.max(
        0,
        Math.min(1, progress.current + deltaY * speed * 2)
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [containerRef, speed]);

  return progress;
}
