"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";

interface UseSectionScrollProgressOptions {
  extraScrollDistance?: number;
}

export function useSectionScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
  options?: UseSectionScrollProgressOptions
) {
  const progress = useRef(0);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () =>
          `+=${containerRef.current!.offsetHeight + (options?.extraScrollDistance ?? 0)}`,
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      return () => trigger.kill();
    },
    [containerRef]
  );

  return progress;
}
