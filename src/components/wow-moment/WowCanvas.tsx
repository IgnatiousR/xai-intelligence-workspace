"use client";

import { useRef, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import "@/shaders/morphCloud"; // ensure extend() runs before Canvas mounts
import MorphingPointCloud from "./MorphingPointCloud";
import WowConnectionLines from "./WowConnectionLines";

export default function WowCanvas({
  wowProgress,
  containerRef,
  visible,
}: {
  wowProgress: RefObject<number>;
  containerRef: RefObject<HTMLElement | null>;
  visible: React.MutableRefObject<boolean>;
}) {
  const sharedPositions = useRef<Float32Array>(new Float32Array(700 * 3));

  return (
    <Canvas
      camera={{ fov: 50, position: [0, 0, 6], near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
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
