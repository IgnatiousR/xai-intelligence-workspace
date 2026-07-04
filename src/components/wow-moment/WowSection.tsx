"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { useVisibilityObserver } from "@/hooks/useVisibilityObserver";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";
import dynamic from "next/dynamic";
import WowOverlay from "./WowOverlay";

const WowCanvas = dynamic(() => import("./WowCanvas"), { ssr: false });

export default function WowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const visible = useVisibilityObserver(containerRef);
  const progress = useWheelProgress(containerRef, { speed: 0.001 });

  useRevealAnimation(headerRef, windowRef);

  return (
    <section
      id="wow"
      className="relative overflow-hidden px-6 py-28 sm:py-36 scroll-mt-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[.025] blur-[180px]" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-10 text-center">
          <SectionHeader
            label="Interactive Experience"
            heading="Watch intelligence emerge"
            subtitle="Move your cursor to shape the data. Scroll to transform chaos into structure."
          />
        </div>
        <div
          ref={containerRef}
          className="relative h-[560px] overflow-hidden rounded-2xl border border-bdr bg-card/40 backdrop-blur-sm"
          aria-label="Interactive 3D data visualization"
        >
          <div ref={windowRef} className="h-full">
            <WowCanvas wowProgress={progress} containerRef={containerRef} visible={visible} />
          </div>
          <WowOverlay progress={progress} />
        </div>
      </div>
    </section>
  );
}
