"use client";

import { useRef, useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointer } from "@/hooks/usePointer";

const WN = 700;
const eps = 0.0001;

interface MorphingPointCloudProps {
  wowProgress: RefObject<number>;
  containerRef: RefObject<HTMLElement | null>;
}

export default function MorphingPointCloud({
  wowProgress,
  containerRef,
}: MorphingPointCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<any>(null);
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
        let cx = (Math.random() - 0.5) * 4;
        let cy = (Math.random() - 0.5) * 4;
        let cz = (Math.random() - 0.5) * 4;
        const mc = Math.max(Math.abs(cx), Math.abs(cy), Math.abs(cz), eps);
        const s = 1.9 / mc;
        cube[i * 3] = cx * s;
        cube[i * 3 + 1] = cy * s;
        cube[i * 3 + 2] = cz * s;

        // Torus knot
        const tt = (i / WN) * Math.PI * 2 * 5;
        const tr2 = 1.7;
        const tu = 0.55 + Math.random() * 0.1;
        const tw = 3;
        torus[i * 3] = (tr2 + tu * Math.cos(tw * tt)) * Math.cos(tt);
        torus[i * 3 + 1] = (tr2 + tu * Math.cos(tw * tt)) * Math.sin(tt);
        torus[i * 3 + 2] = tu * Math.sin(tw * tt);

        sz[i] = Math.random() * 2.8 + 0.8;
        const c = new THREE.Color().lerpColors(
          new THREE.Color("#c8ff00"),
          new THREE.Color("#ebebeb"),
          Math.random() * 0.55
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
    [sphereTargets]
  );

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

    if (materialRef.current) {
      materialRef.current.uDpr = Math.min(state.gl.getPixelRatio(), 2);
      materialRef.current.uTime = t;
      materialRef.current.uMouse.set(pointer.current.x, pointer.current.y);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.12 + pointer.current.x * 0.3;
      pointsRef.current.rotation.x = pointer.current.y * 0.15;
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
      <morphCloudMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
