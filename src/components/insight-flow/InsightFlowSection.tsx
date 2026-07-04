"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { stages } from "@/data/stages";
import { SectionHeader } from "@/components/ui/SectionHeader";
import StageBlock from "./StageBlock";
import StageLine from "./StageLine";
import IngestCanvas from "./canvases/IngestCanvas";
import AnalyzeCanvas from "./canvases/AnalyzeCanvas";
import InsightCanvas from "./canvases/InsightCanvas";

const canvasMap: Record<string, React.ReactNode> = {
  ingest: <IngestCanvas />,
  analyze: <AnalyzeCanvas />,
  insight: <InsightCanvas />,
};

export default function InsightFlowSection() {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;
      gsap.set(headerRef.current, { y: 25, opacity: 0 });
      gsap.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: headerRef.current, start: "top 82%" },
      });
    },
    { scope: headerRef }
  );

  return (
    <section id="flow" className="relative px-6 py-28 sm:py-36 scroll-mt-14">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-20 sm:mb-28">
          <SectionHeader
            label="How It Works"
            heading={
              <>
                Three stages of
                <br />
                intelligent transformation
              </>
            }
          />
        </div>
        <div className="relative">
          <StageLine />
          {stages.map((stage, i) => (
            <StageBlock
              key={stage.id}
              index={stage.index}
              title={stage.title}
              body={stage.body}
              tags={stage.tags}
              canvas={canvasMap[stage.id]}
              reversed={i === 1}
              last={i === stages.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
