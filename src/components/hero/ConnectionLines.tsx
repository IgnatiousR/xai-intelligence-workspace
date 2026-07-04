"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";
import { DESKTOP, MOBILE } from "@/lib/particleConfig";
import { updateConnections } from "@/lib/webgl-utils";

const MAX_LN = 180;
const MAX_DIST = 0.8; // reduced from 1.3 to avoid long visible lines
const linePositions = new Float32Array(MAX_LN * 6);

interface ConnectionLinesProps {
  sourcePositions: RefObject<Float32Array>;
  heroProgress: RefObject<number>;
  visible: RefObject<boolean>;
}

export default function ConnectionLines({
  sourcePositions,
  heroProgress,
  visible,
}: ConnectionLinesProps) {
  const lineGeo = useRef<THREE.BufferGeometry>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const timer = useRef(0);
  const isMobile = useIsMobile();
  const LN = isMobile ? MOBILE.heroLines : DESKTOP.heroLines;
  const N = isMobile ? MOBILE.heroParticles : DESKTOP.heroParticles;
  const SAMPLES = isMobile ? MOBILE.heroSamples : DESKTOP.heroSamples;

  useFrame((state, delta) => {
    if (!visible.current) return;
    timer.current += delta;
    if (timer.current < 0.2) return;
    timer.current = 0;

    const p = sourcePositions.current;
    if (!p) return;

    updateConnections(linePositions, p, LN, N, SAMPLES, MAX_DIST);
    if (lineGeo.current) {
      lineGeo.current.attributes.position.needsUpdate = true;
    }
  });

  useFrame(() => {
    if (!visible.current) return;
    if (lineMat.current) {
      lineMat.current.opacity = 0.01 + heroProgress.current * 0.03;
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
        ref={lineMat}
        color={0xc8ff00}
        transparent
        opacity={0.02}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
