"use client";

import { useRef } from "react";
// import { gsap } from "@/lib/gsap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";
import DashboardWindow from "./DashboardWindow";

export default function DashboardSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(headerRef, windowRef);

  return (
    <section
      id="dashboard"
      className="relative px-6 py-28 sm:py-36 scroll-mt-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bg-el/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-14 text-center">
          <SectionHeader
            label="Product Preview"
            heading="Intelligence at your fingertips"
            subtitle="A workspace designed for clarity. Every metric, every insight, one unified view."
          />
        </div>
        <div ref={windowRef}>
          <DashboardWindow />
        </div>
      </div>
    </section>
  );
}
