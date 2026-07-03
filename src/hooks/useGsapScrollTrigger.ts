"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface UseGsapScrollTriggerOptions {
  trigger: React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  scrub?: boolean | number;
}

export function useGsapScrollTrigger(options: UseGsapScrollTriggerOptions) {
  const contextRef = useRef<gsap.Context | null>(null);

  useGSAP(
    () => {
      if (!options.trigger.current) return;

      contextRef.current = gsap.context(() => {
        ScrollTrigger.create({
          trigger: options.trigger.current,
          start: options.start ?? "top 80%",
          end: options.end ?? "bottom 20%",
          onEnter: options.onEnter,
          onLeave: options.onLeave,
          onEnterBack: options.onEnterBack,
          onLeaveBack: options.onLeaveBack,
          scrub: options.scrub,
        });
      });
    },
    { scope: options.trigger }
  );

  useEffect(() => {
    return () => {
      contextRef.current?.revert();
    };
  }, []);
}
