"use client";

import { useRef, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import "@/shaders/morphCloud"; // ensure extend() runs before Canvas mounts
import MorphingPointCloud from "./MorphingPointCloud";
import WowConnectionLines from "./WowConnectionLines";
import { useIsMobile } from "@/hooks/useIsMobile";
import { DESKTOP, MOBILE } from "@/lib/particleConfig";

export default function WowCanvas({
  wowProgress,
  containerRef,
  visible,
}: {
  wowProgress: RefObject<number>;
  containerRef: RefObject<HTMLElement | null>;
  visible: React.MutableRefObject<boolean>;
}) {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? MOBILE.wowParticles : DESKTOP.wowParticles;
  const dprMax = isMobile ? MOBILE.dprMax : DESKTOP.dprMax;
  const sharedPositions = useRef<Float32Array>(new Float32Array(particleCount * 3));

  return (
    <Canvas
      camera={{ fov: 50, position: [0, 0, 6], near: 0.1, far: 100 }}
      dpr={[1, dprMax]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <MorphingPointCloud
        wowProgress={wowProgress}
        containerRef={containerRef}
        sharedPositionsRef={sharedPositions}
        visible={visible}
      />
      <WowConnectionLines sourcePositions={sharedPositions} visible={visible} />
    </Canvas>
  );
}
