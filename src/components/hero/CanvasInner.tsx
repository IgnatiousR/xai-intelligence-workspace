"use client";

import { useRef, useEffect, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import "@/shaders/particleField"; // ensure extend() runs before Canvas mounts
import ParticleField from "./ParticleField";
import ConnectionLines from "./ConnectionLines";
import { useIsMobile } from "@/hooks/useIsMobile";
import { DESKTOP, MOBILE } from "@/lib/particleConfig";

function SceneContent({
  sectionRef,
  heroProgress,
  visible,
  particleCount,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  heroProgress: React.MutableRefObject<number>;
  visible: React.MutableRefObject<boolean>;
  particleCount: number;
}) {
  const sharedPositions = useRef<Float32Array>(new Float32Array(particleCount * 3));

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sy = window.scrollY;
      const hh = el.offsetHeight;
      heroProgress.current = Math.min(sy / Math.max(hh, 1), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionRef, heroProgress]);

  return (
    <>
      <ParticleField
        heroProgress={heroProgress}
        sharedPositionsRef={sharedPositions}
        containerRef={sectionRef}
        visible={visible}
      />
      <ConnectionLines sourcePositions={sharedPositions} heroProgress={heroProgress} visible={visible} />
    </>
  );
}

export default function CanvasInner({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const heroProgress = useRef(0);
  const visible = useRef(true);
  const isMobile = useIsMobile();
  const particleCount = isMobile ? MOBILE.heroParticles : DESKTOP.heroParticles;
  const dprMax = isMobile ? MOBILE.dprMax : DESKTOP.dprMax;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { visible.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionRef]);

  return (
    <Canvas
      camera={{ fov: 55, position: [0, 0, 6], near: 0.1, far: 500 }}
      dpr={[1, dprMax]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <SceneContent sectionRef={sectionRef} heroProgress={heroProgress} visible={visible} particleCount={particleCount} />
    </Canvas>
  );
}
