"use client";

import { useRef, useMemo, type RefObject, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointer } from "@/hooks/usePointer";
import { updateParticleMaterial } from "@/lib/updateParticleMaterial";

const WN = 700;
const eps = 0.0001;

// Pre-compute random values at module scope to avoid Math.random() during render
const rndCubeX = Float32Array.from({ length: WN }, () => Math.random());
const rndCubeY = Float32Array.from({ length: WN }, () => Math.random());
const rndCubeZ = Float32Array.from({ length: WN }, () => Math.random());
const rndTorusU = Float32Array.from({ length: WN }, () => Math.random());
const rndSize = Float32Array.from({ length: WN }, () => Math.random());
const rndColor = Float32Array.from({ length: WN }, () => Math.random());

interface MorphingPointCloudProps {
  wowProgress: RefObject<number>;
  containerRef: RefObject<HTMLElement | null>;
  sharedPositionsRef: RefObject<Float32Array>;
}

export default function MorphingPointCloud({
  wowProgress,
  containerRef,
  sharedPositionsRef,
}: MorphingPointCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = usePointer(containerRef);

  const { sphereTargets, cubeTargets, torusTargets, sizes, colors } =
    useMemo(() => {
      const sphere = new Float32Array(WN * 3);
      const cube = new Float32Array(WN * 3);
      const torus = new Float32Array(WN * 3);
      const sz = new Float32Array(WN);
      const col = new Float32Array(WN * 3);

      for (let i = 0; i < WN; i++) {
        // Sphere (Fibonacci)
        const phi = Math.acos(-1 + (2 * i) / WN);
        const theta = Math.sqrt(WN * Math.PI) * phi;
        const r = 2.3;
        sphere[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        sphere[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        sphere[i * 3 + 2] = r * Math.cos(phi);

        // Cube surface
        const cx = (rndCubeX[i] - 0.5) * 4;
        const cy = (rndCubeY[i] - 0.5) * 4;
        const cz = (rndCubeZ[i] - 0.5) * 4;
        const mc = Math.max(Math.abs(cx), Math.abs(cy), Math.abs(cz), eps);
        const s = 1.9 / mc;
        cube[i * 3] = cx * s;
        cube[i * 3 + 1] = cy * s;
        cube[i * 3 + 2] = cz * s;

        // Torus knot
        const tt = (i / WN) * Math.PI * 2 * 5;
        const tr2 = 1.7;
        const tu = 0.55 + rndTorusU[i] * 0.1;
        const tw = 3;
        torus[i * 3] = (tr2 + tu * Math.cos(tw * tt)) * Math.cos(tt);
        torus[i * 3 + 1] = (tr2 + tu * Math.cos(tw * tt)) * Math.sin(tt);
        torus[i * 3 + 2] = tu * Math.sin(tw * tt);

        sz[i] = rndSize[i] * 2.8 + 0.8;
        const c = new THREE.Color().lerpColors(
          new THREE.Color("#c8ff00"),
          new THREE.Color("#ebebeb"),
          rndColor[i] * 0.55,
        );
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
      }
      return {
        sphereTargets: sphere,
        cubeTargets: cube,
        torusTargets: torus,
        sizes: sz,
        colors: col,
      };
    }, []);

  const positions = useMemo(
    () => Float32Array.from(sphereTargets),
    [sphereTargets],
  );

  // Sync shared positions after render, not during it
  useEffect(() => {
    sharedPositionsRef.current = positions;
  }, [positions, sharedPositionsRef]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position.array as Float32Array;
    const sp = 0.035;
    const wowP = wowProgress.current;

    for (let i = 0; i < WN; i++) {
      const i3 = i * 3;
      let tx: number, ty: number, tz: number;

      if (wowP < 0.33) {
        const f = wowP / 0.33;
        tx = sphereTargets[i3] + (cubeTargets[i3] - sphereTargets[i3]) * f;
        ty =
          sphereTargets[i3 + 1] +
          (cubeTargets[i3 + 1] - sphereTargets[i3 + 1]) * f;
        tz =
          sphereTargets[i3 + 2] +
          (cubeTargets[i3 + 2] - sphereTargets[i3 + 2]) * f;
      } else if (wowP < 0.66) {
        const f = (wowP - 0.33) / 0.33;
        tx = cubeTargets[i3] + (torusTargets[i3] - cubeTargets[i3]) * f;
        ty =
          cubeTargets[i3 + 1] +
          (torusTargets[i3 + 1] - cubeTargets[i3 + 1]) * f;
        tz =
          cubeTargets[i3 + 2] +
          (torusTargets[i3 + 2] - cubeTargets[i3 + 2]) * f;
      } else {
        const f = (wowP - 0.66) / 0.34;
        tx = torusTargets[i3] + (sphereTargets[i3] - torusTargets[i3]) * f;
        ty =
          torusTargets[i3 + 1] +
          (sphereTargets[i3 + 1] - torusTargets[i3 + 1]) * f;
        tz =
          torusTargets[i3 + 2] +
          (sphereTargets[i3 + 2] - torusTargets[i3 + 2]) * f;
      }

      pos[i3] += (tx - pos[i3]) * sp;
      pos[i3 + 1] += (ty - pos[i3 + 1]) * sp;
      pos[i3 + 2] += (tz - pos[i3 + 2]) * sp;
    }
    geo.attributes.position.needsUpdate = true;

    updateParticleMaterial({
      materialRef,
      pointsRef,
      state,
      t,
      pointerX: pointer.current.x,
      pointerY: pointer.current.y,
      rotationSpeedY: 0.12,
      pointerInfluenceY: 0.3,
      pointerInfluenceX: 0.15,
    });
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <morphCloudMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
