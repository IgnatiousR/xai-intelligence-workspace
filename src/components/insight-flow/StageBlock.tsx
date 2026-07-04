"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Tag } from "@/components/ui/Tag";

interface StageBlockProps {
  index: string;
  title: string;
  body: string;
  tags: string[];
  canvas: React.ReactNode;
  reversed?: boolean;
  last?: boolean;
}

export default function StageBlock({
  index,
  title,
  body,
  tags,
  canvas,
  reversed,
  last,
}: StageBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.set(ref.current, { y: 40, opacity: 0 });
      gsap.to(ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={cn(!last && "mb-16 lg:mb-28")}
    >
      <div className="items-center lg:grid lg:grid-cols-2 lg:gap-14">
        <div
          className={cn(
            "mb-8 lg:mb-0",
            reversed
              ? "order-1 lg:order-2 lg:pl-4"
              : "lg:pr-4 lg:text-right"
          )}
        >
          <span className="font-display text-6xl font-bold leading-none text-accent/15">
            {index}
          </span>
          <h3 className="mb-3 mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed text-fg-m">{body}</p>
          <div
            className={cn(
              "mt-5 flex flex-wrap gap-1.5",
              !reversed && "lg:justify-end"
            )}
          >
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <div
          className={cn(
            reversed && "order-2 lg:order-1",
            "rounded-2xl border border-bdr bg-card p-5 border-gradient-hover transition-all duration-400 hover:border-accent/25 hover:shadow-[0_8px_40px_rgba(200,255,0,0.06)]"
          )}
        >
          <div className="aspect-video overflow-hidden rounded-xl bg-bg-el">
            {canvas}
          </div>
        </div>
      </div>
    </div>
  );
}
