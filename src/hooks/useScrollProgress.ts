"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useScrollProgress() {
  const progress = useRef(0);

  const createTrigger = useCallback(
    (trigger: HTMLElement, options?: { start?: string; end?: string }) => {
      return ScrollTrigger.create({
        trigger,
        start: options?.start ?? "top bottom",
        end: options?.end ?? "bottom top",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    },
    []
  );

  return { progress, createTrigger };
}
