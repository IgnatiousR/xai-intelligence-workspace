"use client";

import { useRef, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import "@/shaders/morphCloud"; // ensure extend() runs before Canvas mounts
import MorphingPointCloud from "./MorphingPointCloud";
import WowConnectionLines from "./WowConnectionLines";

export default function WowCanvas({
  wowProgress,
  containerRef,
}: {
  wowProgress: RefObject<number>;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const sharedPositions = useRef<Float32Array>(new Float32Array(700 * 3));

  return (
    <Canvas
      camera={{ fov: 50, position: [0, 0, 6], near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <MorphingPointCloud wowProgress={wowProgress} containerRef={containerRef} />
      <WowConnectionLines sourcePositions={sharedPositions} />
    </Canvas>
  );
}
