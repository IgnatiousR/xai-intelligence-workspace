"use client";

import { useRef, useEffect, type RefObject } from "react";

export function usePointer(containerRef?: RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const target = containerRef?.current ?? window;
    const onMove = (e: MouseEvent) => {
      const rect = containerRef?.current?.getBoundingClientRect();
      const w = rect?.width ?? window.innerWidth;
      const h = rect?.height ?? window.innerHeight;
      const x = rect ? e.clientX - rect.left : e.clientX;
      const y = rect ? e.clientY - rect.top : e.clientY;
      pointer.current.x = (x / w) * 2 - 1;
      pointer.current.y = -(y / h) * 2 + 1;
    };
    target.addEventListener("mousemove", onMove as EventListener);
    return () =>
      target.removeEventListener("mousemove", onMove as EventListener);
  }, [containerRef]);

  return pointer;
}
