"use client";

import { motion } from "motion/react";

const scrollItem = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: 1.1 },
  },
};

export default function ScrollIndicator() {
  return (
    <motion.div
      variants={scrollItem}
      initial="hidden"
      animate="show"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-[2]"
      aria-hidden
    >
      <span className="text-fg-m text-[10px] font-body tracking-[.2em] uppercase">
        Scroll
      </span>
      <div className="w-4 h-7 border border-fg-m/25 rounded-full flex justify-center pt-1">
        <div className="w-0.5 h-1.5 bg-accent rounded-full animate-float-dot" />
      </div>
    </motion.div>
  );
}
