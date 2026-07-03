"use client";

import { useRef, useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointer } from "@/hooks/usePointer";

const N = 1600;

interface ParticleFieldProps {
  heroProgress: RefObject<number>;
  sharedPositions: RefObject<Float32Array>;
}

export default function ParticleField({
  heroProgress,
  sharedPositions,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<any>(null);
  const pointer = usePointer();

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

      rand[i * 3] = (Math.random() - 0.5) * 14;
      rand[i * 3 + 1] = (Math.random() - 0.5) * 14;
      rand[i * 3 + 2] = (Math.random() - 0.5) * 10;

      sz[i] = Math.random() * 2.5 + 0.6;
      const c = new THREE.Color().lerpColors(dim, accent, Math.random() * 0.35);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { randPositions: rand, gridPositions: grid, sizes: sz, colors: col };
  }, []);

  const positions = useMemo(
    () => Float32Array.from(randPositions),
    [randPositions]
  );

  // Sync shared positions ref so ConnectionLines can read them
  sharedPositions.current = positions;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position.array as Float32Array;
    const sp = 0.022;
    const p = heroProgress.current;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      for (const axis of [0, 1, 2]) {
        const target =
          randPositions[i3 + axis] +
          (gridPositions[i3 + axis] - randPositions[i3 + axis]) * p;
        pos[i3 + axis] += (target - pos[i3 + axis]) * sp;
      }
    }
    geo.attributes.position.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.uDpr = Math.min(state.gl.getPixelRatio(), 2);
      materialRef.current.uTime = t;
      materialRef.current.uMouse.set(pointer.current.x, pointer.current.y);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04 + pointer.current.x * 0.12;
      pointsRef.current.rotation.x = pointer.current.y * 0.06;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
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
