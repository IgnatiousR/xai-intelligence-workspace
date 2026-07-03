"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  label: string;
  value: number;
  displayValue: string;
  opacity?: number;
}

export default function ProgressBar({
  label,
  value,
  displayValue,
  opacity = 1,
}: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-fg-m font-body">{label}</span>
        <span className="font-display font-medium">{displayValue}</span>
      </div>
      <div className="h-1 bg-bg rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          style={{ opacity }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        />
      </div>
    </div>
  );
}
