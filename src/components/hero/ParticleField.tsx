"use client";

import { useRef, useMemo, useEffect, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointer } from "@/hooks/usePointer";
import { updateParticleMaterial } from "@/lib/updateParticleMaterial";

const N = 1600;

// Pre-compute random values at module scope to avoid Math.random() during render
const rndX = Float32Array.from({ length: N }, () => Math.random());
const rndY = Float32Array.from({ length: N }, () => Math.random());
const rndZ = Float32Array.from({ length: N }, () => Math.random());
const rndSize = Float32Array.from({ length: N }, () => Math.random());
const rndColor = Float32Array.from({ length: N }, () => Math.random());

interface ParticleFieldProps {
  heroProgress: RefObject<number>;
  sharedPositionsRef: RefObject<Float32Array>; // renamed
  containerRef: RefObject<HTMLElement | null>;
  visible: React.MutableRefObject<boolean>;
}

export default function ParticleField({
  heroProgress,
  sharedPositionsRef, // renamed
  containerRef,
  visible,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = usePointer(containerRef);

  const { randPositions, gridPositions, sizes, colors } = useMemo(() => {
    const rand = new Float32Array(N * 3);
    const grid = new Float32Array(N * 3);
    const sz = new Float32Array(N);
    const col = new Float32Array(N * 3);
    const gridSide = Math.ceil(Math.cbrt(N));
    const accent = new THREE.Color("#c8ff00");
    const dim = new THREE.Color("#3a3a4a");

    for (let i = 0; i < N; i++) {
      const ix = i % gridSide;
      const iy = Math.floor(i / gridSide) % gridSide;
      const iz = Math.floor(i / (gridSide * gridSide));
      grid[i * 3] = (ix - gridSide / 2) * 0.32;
      grid[i * 3 + 1] = (iy - gridSide / 2) * 0.32;
      grid[i * 3 + 2] = (iz - gridSide / 2) * 0.32;

      rand[i * 3] = (rndX[i] - 0.5) * 14;
      rand[i * 3 + 1] = (rndY[i] - 0.5) * 14;
      rand[i * 3 + 2] = (rndZ[i] - 0.5) * 10;

      sz[i] = rndSize[i] * 2.5 + 0.6;
      const c = new THREE.Color().lerpColors(dim, accent, rndColor[i] * 0.35);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { randPositions: rand, gridPositions: grid, sizes: sz, colors: col };
  }, []);

  const positions = useMemo(() => Float32Array.from(randPositions), [randPositions]);

  // Sync shared positions after render, not during it
  useEffect(() => {
    sharedPositionsRef.current = positions;
  }, [positions, sharedPositionsRef]);

  useFrame((state) => {
    if (!visible.current) return;
    const t = state.clock.elapsedTime;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position.array as Float32Array;
    const sp = 0.022;
    const p = heroProgress.current;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      for (let axis = 0; axis < 3; axis++) {
        const target =
          randPositions[i3 + axis] + (gridPositions[i3 + axis] - randPositions[i3 + axis]) * p;
        pos[i3 + axis] += (target - pos[i3 + axis]) * sp;
      }
    }
    geo.attributes.position.needsUpdate = true;

    updateParticleMaterial({
      materialRef,
      pointsRef,
      state,
      t,
      pointerX: pointer.current.x,
      pointerY: pointer.current.y,
    });
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <particleFieldMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
