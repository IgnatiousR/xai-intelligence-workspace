"use client";

import { useRef, useEffect, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import "@/shaders/particleField"; // ensure extend() runs before Canvas mounts
import ParticleField from "./ParticleField";
import ConnectionLines from "./ConnectionLines";

function SceneContent({
  sectionRef,
  heroProgress,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  heroProgress: React.MutableRefObject<number>;
}) {
  const sharedPositions = useRef<Float32Array>(new Float32Array(1600 * 3));

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
      <ParticleField heroProgress={heroProgress} sharedPositions={sharedPositions} />
      <ConnectionLines
        sourcePositions={sharedPositions}
        heroProgress={heroProgress}
      />
    </>
  );
}

export default function CanvasInner({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const heroProgress = useRef(0);

  return (
    <Canvas
      camera={{ fov: 55, position: [0, 0, 6], near: 0.1, far: 500 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContent sectionRef={sectionRef} heroProgress={heroProgress} />
    </Canvas>
  );
}
