"use client";

import { useState, useEffect, type RefObject } from "react";

interface WowOverlayProps {
  progress: RefObject<number>;
}

const STAGES = [
  { label: "Raw Data", threshold: 0 },
  { label: "Structured Grid", threshold: 33 },
  { label: "Intelligence Network", threshold: 66 },
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
    <div className="pointer-events-none absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-y-3 gap-x-6">
      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const isCompleted = i < activeIndex;
          const isCurrent = i === activeIndex;
          return (
            <div key={stage.label} className="flex items-center">
              <span
                className={[
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors duration-300",
                  isCompleted
                    ? "border-accent bg-accent text-bg"
                    : isCurrent
                      ? "border-accent text-accent"
                      : "border-fg-m/30 text-fg-m/40",
                ].join(" ")}
              >
                {isCompleted ? "✓" : i + 1}
              </span>
              <span
                className={[
                  "ml-2 whitespace-nowrap font-display text-[11px] font-medium transition-colors duration-300 sm:text-xs",
                  isCompleted ? "text-fg-m" : isCurrent ? "text-fg" : "text-fg-m/40",
                ].join(" ")}
              >
                {stage.label}
              </span>
              {i < STAGES.length - 1 && (
                <span
                  className={[
                    "mx-2 h-px w-5 shrink-0 transition-colors duration-300 sm:w-8",
                    isCompleted ? "bg-accent/60" : "bg-fg-m/20",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-right">
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
