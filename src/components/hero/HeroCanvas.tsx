"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";

const CanvasInner = dynamic(() => import("./CanvasInner"), { ssr: false });

export default function HeroCanvas({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div className="absolute inset-0 z-0">
      <CanvasInner sectionRef={sectionRef} />
    </div>
  );
}
