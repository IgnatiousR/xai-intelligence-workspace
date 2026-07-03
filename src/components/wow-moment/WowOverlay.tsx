"use client";

import { useState, useEffect, type RefObject } from "react";

interface WowOverlayProps {
  progress: RefObject<number>;
}

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

  const stateLabel =
    displayProgress < 33
      ? "Raw Data"
      : displayProgress < 66
        ? "Structured Grid"
        : "Intelligence Network";

  return (
    <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
      <div>
        <div className="mb-0.5 text-[10px] uppercase tracking-wide text-fg-m font-body">
          Current State
        </div>
        <div className="font-display text-base font-semibold">{stateLabel}</div>
      </div>
      <div className="text-right">
        <div className="mb-1 text-[10px] text-fg-m font-body">
          Scroll to transform
        </div>
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
