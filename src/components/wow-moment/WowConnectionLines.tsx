"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const WLN = 250;
const WN = 700;
const linePositions = new Float32Array(WLN * 6);

interface WowConnectionLinesProps {
  sourcePositions: RefObject<Float32Array>;
}

export default function WowConnectionLines({
  sourcePositions,
}: WowConnectionLinesProps) {
  const lineGeo = useRef<THREE.BufferGeometry>(null);
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 10 !== 0) return;

    const p = sourcePositions.current;
    if (!p) return;

    for (let i = 0; i < WLN; i++) {
      let bA = -1,
        bB = -1,
        bD = 1.1; // MAX_DIST inlined as before
      for (let t = 0; t < 12; t++) {
        const a = (Math.random() * WN) | 0;
        const b = (Math.random() * WN) | 0;
        if (a === b) continue;
        const dx = p[a * 3] - p[b * 3];
        const dy = p[a * 3 + 1] - p[b * 3 + 1];
        const dz = p[a * 3 + 2] - p[b * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < bD) {
          bD = d;
          bA = a;
          bB = b;
        }
      }

      if (bA === -1) continue;

      linePositions[i * 6] = p[bA * 3];
      linePositions[i * 6 + 1] = p[bA * 3 + 1];
      linePositions[i * 6 + 2] = p[bA * 3 + 2];
      linePositions[i * 6 + 3] = p[bB * 3];
      linePositions[i * 6 + 4] = p[bB * 3 + 1];
      linePositions[i * 6 + 5] = p[bB * 3 + 2];
    }
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
