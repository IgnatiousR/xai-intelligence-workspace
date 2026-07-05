"use client";

import { useState, useEffect, type RefObject } from "react";
import { WowStageIndicator } from "./WowStageIndicator";

interface WowOverlayProps {
  progress: RefObject<number>;
}

const STAGES = [
  { label: "Raw Data", threshold: 0 },
  { label: "Structured Grid", threshold: 40 },
  { label: "Intelligence Network", threshold: 85 },
];

export default function WowOverlay({ progress }: WowOverlayProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const sync = () => {
      const p = Math.round(progress.current * 100);
      setDisplayProgress((prev) => (prev !== p ? p : prev));
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const activeIndex = STAGES.reduce(
    (acc, stage, i) => (displayProgress >= stage.threshold ? i : acc),
    0,
  );

  return (
    <div className="pointer-events-none absolute inset-0 p-5 flex flex-col justify-end sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center flex-wrap gap-y-2">
        {STAGES.map((stage, i) => (
          <WowStageIndicator
            key={stage.label}
            label={stage.label}
            index={i}
            activeIndex={activeIndex}
            isLast={i === STAGES.length - 1}
          />
        ))}
      </div>

      <div className="absolute top-5 right-5 text-right sm:static">
        <div className="mb-1 text-[10px] text-fg-m font-body">Scroll to transform</div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-28 overflow-hidden rounded-full bg-bg-el">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-200"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <span className="w-8 text-right font-display text-[11px] font-medium text-accent">
            {displayProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
