"use client";

import { useRef, useMemo, type RefObject } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointer } from "@/hooks/usePointer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { updateParticleMaterial } from "@/lib/updateParticleMaterial";
import { DESKTOP, MOBILE } from "@/lib/particleConfig";
import { useParticleSetup, useParticleFrame } from "@/hooks/useParticleSetup";
import { ParticlePoints } from "@/components/shared/ParticlePoints";

const MAX_WN = 700;
// const eps = 0.0001;

// Pre-compute random values at module scope to avoid Math.random() during render
// const rndCubeX = Float32Array.from({ length: MAX_WN }, () => Math.random());
// const rndCubeY = Float32Array.from({ length: MAX_WN }, () => Math.random());
// const rndCubeZ = Float32Array.from({ length: MAX_WN }, () => Math.random());
const rndTorusU = Float32Array.from({ length: MAX_WN }, () => Math.random());
const rndSize = Float32Array.from({ length: MAX_WN }, () => Math.random());
const rndColor = Float32Array.from({ length: MAX_WN }, () => Math.random());

const rndChaosX = Float32Array.from({ length: MAX_WN }, () => Math.random());
const rndChaosY = Float32Array.from({ length: MAX_WN }, () => Math.random());
const rndChaosZ = Float32Array.from({ length: MAX_WN }, () => Math.random());

interface MorphingPointCloudProps {
  wowProgress: RefObject<number>;
  containerRef: RefObject<HTMLElement | null>;
  sharedPositionsRef: RefObject<Float32Array>;
  visible: RefObject<boolean>;
}

export default function MorphingPointCloud({
  wowProgress,
  containerRef,
  sharedPositionsRef,
  visible,
}: MorphingPointCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = usePointer(containerRef);
  const isMobile = useIsMobile();
  const WN = isMobile ? MOBILE.wowParticles : DESKTOP.wowParticles;

  const { gridTargets, torusTargets, chaosTargets, sizes, colors } = useMemo(() => {
    const grid = new Float32Array(WN * 3);
    const torus = new Float32Array(WN * 3);
    const chaos = new Float32Array(WN * 3);
    const sz = new Float32Array(WN);
    const col = new Float32Array(WN * 3);
    const c = new THREE.Color();
    const accentCol = new THREE.Color("#c8ff00");
    const dimCol = new THREE.Color("#ebebeb");

    const d = Math.ceil(Math.cbrt(WN));
    const step = 4.0 / d; // Scale grid to fit viewport (approx width 4.0)

    for (let i = 0; i < WN; i++) {
      // 3D Grid
      const ix = i % d;
      const iy = Math.floor(i / d) % d;
      const iz = Math.floor(i / (d * d));
      grid[i * 3] = (ix - d / 2 + 0.5) * step;
      grid[i * 3 + 1] = (iy - d / 2 + 0.5) * step;
      grid[i * 3 + 2] = (iz - d / 2 + 0.5) * step;

      // Torus knot
      const tt = (i / WN) * Math.PI * 2 * 5;
      const tr2 = 1.7;
      const tu = 0.55 + rndTorusU[i] * 0.1;
      const tw = 3;
      torus[i * 3] = (tr2 + tu * Math.cos(tw * tt)) * Math.cos(tt);
      torus[i * 3 + 1] = (tr2 + tu * Math.cos(tw * tt)) * Math.sin(tt);
      torus[i * 3 + 2] = tu * Math.sin(tw * tt);

      // Chaos: fully scattered, no structure, wider spread than any organized shape
      chaos[i * 3] = (rndChaosX[i] - 0.5) * 7.5;
      chaos[i * 3 + 1] = (rndChaosY[i] - 0.5) * 7.5;
      chaos[i * 3 + 2] = (rndChaosZ[i] - 0.5) * 5.5;

      // sz[i] = rndSize[i] * 2.8 + 0.8;
      // after — skewed: many small particles, fewer large standout ones
      sz[i] = Math.pow(rndSize[i], 2.4) * 3.6 + 0.5;
      c.lerpColors(accentCol, dimCol, rndColor[i] * 0.55);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return {
      gridTargets: grid,
      torusTargets: torus,
      chaosTargets: chaos,
      sizes: sz,
      colors: col,
    };
  }, []);

  const positions = useParticleSetup(sharedPositionsRef, chaosTargets);

  useParticleFrame(visible, pointsRef, (state, delta, pos, t, geo) => {
    const sp = Math.min(delta * 2.1, 1);
    const wowP = wowProgress.current;

    for (let i = 0; i < WN; i++) {
      const i3 = i * 3;
      let tx: number, ty: number, tz: number;

      if (wowP < 0.5) {
        const f = wowP / 0.5;
        tx = chaosTargets[i3] + (gridTargets[i3] - chaosTargets[i3]) * f;
        ty = chaosTargets[i3 + 1] + (gridTargets[i3 + 1] - chaosTargets[i3 + 1]) * f;
        tz = chaosTargets[i3 + 2] + (gridTargets[i3 + 2] - chaosTargets[i3 + 2]) * f;
      } else {
        const f = (wowP - 0.5) / 0.5;
        tx = gridTargets[i3] + (torusTargets[i3] - gridTargets[i3]) * f;
        ty = gridTargets[i3 + 1] + (torusTargets[i3 + 1] - gridTargets[i3 + 1]) * f;
        tz = gridTargets[i3 + 2] + (torusTargets[i3 + 2] - gridTargets[i3 + 2]) * f;
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
    <ParticlePoints ref={pointsRef} positions={positions} sizes={sizes} colors={colors}>
      <morphCloudMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </ParticlePoints>
  );
}
