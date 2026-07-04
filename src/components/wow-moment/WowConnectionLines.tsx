"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";
import { DESKTOP, MOBILE } from "@/lib/particleConfig";
import { updateConnections } from "@/lib/webgl-utils";

const MAX_WLN = 250;
const MAX_DIST = 1.1;
const linePositions = new Float32Array(MAX_WLN * 6);

interface WowConnectionLinesProps {
  sourcePositions: RefObject<Float32Array>;
  visible: RefObject<boolean>;
}

export default function WowConnectionLines({
  sourcePositions,
  visible,
}: WowConnectionLinesProps) {
  const lineGeo = useRef<THREE.BufferGeometry>(null);
  const timer = useRef(0);
  const isMobile = useIsMobile();
  const WLN = isMobile ? MOBILE.wowLines : DESKTOP.wowLines;
  const WN = isMobile ? MOBILE.wowParticles : DESKTOP.wowParticles;
  const SAMPLES = isMobile ? MOBILE.wowSamples : DESKTOP.wowSamples;

  useFrame((state, delta) => {
    if (!visible.current) return;
    timer.current += delta;
    if (timer.current < 0.166) return;
    timer.current = 0;

    const p = sourcePositions.current;
    if (!p) return;

    updateConnections(linePositions, p, WLN, WN, SAMPLES, MAX_DIST);
    if (lineGeo.current) {
      lineGeo.current.attributes.position.needsUpdate = true;
    }
  });
  return (
    <lineSegments>
      <bufferGeometry ref={lineGeo}>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={0xc8ff00}
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
