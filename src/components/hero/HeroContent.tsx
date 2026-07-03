"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.35 } },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-[2] text-center px-6 max-w-4xl mx-auto"
    >
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-bdr bg-bg-el/40 backdrop-blur-sm mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
        <span className="text-fg-m text-[11px] font-body tracking-wide">
          Now processing 2.4M data points per second
        </span>
      </motion.div>

      <motion.h1
        variants={item}
        className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[.92] tracking-[-.03em] mb-6"
      >
        From Raw Data
        <br />
        <span className="text-gradient-accent">to Intelligence</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="font-body text-fg-m text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Xai transforms unstructured data streams into structured intelligence,
        actionable insights, and autonomous AI workflows — in real time.
      </motion.p>

      <motion.div variants={item} className="flex items-center justify-center gap-3">
        <Button variant="primary">Start Building</Button>
        <Button variant="secondary">Watch Demo</Button>
      </motion.div>
    </motion.div>
  );
}
