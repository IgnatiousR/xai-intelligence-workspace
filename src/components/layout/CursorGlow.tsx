"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed z-[1] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-300 ease-out"
      style={{
        background:
          "radial-gradient(circle, rgba(200,255,0,.04) 0%, transparent 70%)",
      }}
    />
  );
}
