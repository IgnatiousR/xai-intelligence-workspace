"use client";

import { useMemo, useEffect, type RefObject } from "react";
import { useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";

export function useParticleSetup(
  sharedPositionsRef: RefObject<Float32Array>,
  initialPositions: Float32Array
) {
  const positions = useMemo(() => Float32Array.from(initialPositions), [initialPositions]);

  // Sync shared positions after render, not during it
  useEffect(() => {
    sharedPositionsRef.current = positions;
  }, [positions, sharedPositionsRef]);

  return positions;
}

export function useParticleFrame(
  visible: React.MutableRefObject<boolean> | React.RefObject<boolean>,
  pointsRef: React.RefObject<THREE.Points | null> | React.MutableRefObject<THREE.Points | null>,
  callback: (state: RootState, delta: number, pos: Float32Array, t: number, geo: THREE.BufferGeometry) => void
) {
  useFrame((state, delta) => {
    if (!visible.current) return;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    callback(state, delta, pos, t, geo);
  });
}
