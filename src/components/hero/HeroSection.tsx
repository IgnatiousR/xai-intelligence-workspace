"use client";

import { useRef } from "react";
import HeroCanvas from "./HeroCanvas";
import HeroContent from "./HeroContent";
import ScrollIndicator from "./ScrollIndicator";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden scroll-mt-14"
    >
      <HeroCanvas sectionRef={sectionRef} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-bg/40 to-bg" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[.04] blur-[100px]" />
      <HeroContent />
      <ScrollIndicator />
    </section>
  );
}
