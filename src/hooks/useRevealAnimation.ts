"use client";

import { type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Reusable scroll-reveal animation for section headers and content windows.
 */
export function useRevealAnimation(
  headerRef: RefObject<HTMLElement | null>,
  windowRef: RefObject<HTMLElement | null>
) {
  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { y: 25, opacity: 0 });
        gsap.to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%" },
        });
      }
      if (windowRef.current) {
        gsap.set(windowRef.current, { y: 35, opacity: 0 });
        gsap.to(windowRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: windowRef.current, start: "top 82%" },
        });
      }
    },
    { scope: headerRef }
  );
}
