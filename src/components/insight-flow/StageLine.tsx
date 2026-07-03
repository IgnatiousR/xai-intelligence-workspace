"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function StageLine() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.set(ref.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(ref.current, {
        opacity: 1,
        scaleY: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden lg:block"
      style={{
        opacity: 0,
        background:
          "linear-gradient(to bottom, rgba(200,255,0,.35), rgba(200,255,0,.06), transparent)",
      }}
    />
  );
}
