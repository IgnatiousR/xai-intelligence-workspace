"use client";

import { useRef, useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LN = 180;
const N = 1600;
const MAX_DIST = 0.8; // reduced from 1.3 to avoid long visible lines
const SAMPLES = 18;

interface ConnectionLinesProps {
  sourcePositions: RefObject<Float32Array>;
  heroProgress: RefObject<number>;
}

export default function ConnectionLines({
  sourcePositions,
  heroProgress,
}: ConnectionLinesProps) {
  const lineGeo = useRef<THREE.BufferGeometry>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const frameCount = useRef(0);

  const linePositions = useMemo(() => new Float32Array(LN * 6), []);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 12 !== 0) return;

    const p = sourcePositions.current;
    if (!p) return;

    for (let i = 0; i < LN; i++) {
      let bA = 0,
        bB = 1,
        bD = 99;
      for (let t = 0; t < SAMPLES; t++) {
        const a = (Math.random() * N) | 0;
        const b = (Math.random() * N) | 0;
        if (a === b) continue;
        const dx = p[a * 3] - p[b * 3];
        const dy = p[a * 3 + 1] - p[b * 3 + 1];
        const dz = p[a * 3 + 2] - p[b * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < bD && d < MAX_DIST) {
          bD = d;
          bA = a;
          bB = b;
        }
      }
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

  useFrame(() => {
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
