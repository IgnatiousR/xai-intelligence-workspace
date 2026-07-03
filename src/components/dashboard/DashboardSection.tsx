"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import DashboardWindow from "./DashboardWindow";

export default function DashboardSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

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
