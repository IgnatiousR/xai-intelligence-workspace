"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { tabItems } from "@/data/dashboard";

interface TabBarProps {
  active: string;
  onChange: (id: string) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-5 border-b border-bdr text-[13px] font-body text-fg-m">
      {tabItems.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "relative pb-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded",
            active === t.id ? "text-accent" : "text-fg-m hover:text-fg"
          )}
        >
          {t.label}
          {active === t.id && (
            <motion.div
              layoutId="dtab-underline"
              className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
