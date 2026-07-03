# 03 — Hero Section (React Three Fiber)

This is the first of two Three.js scenes in the original file (`xai.html` lines 453–587 for the logic, 150–177 for the markup). It's a 1,600-point particle field that starts in a random cloud ("raw data") and lerps toward a structured 3D grid as the user scrolls through the hero viewport, with mouse-proximity repulsion and dynamically-recomputed nearest-neighbor connection lines.

## Component breakdown

```
hero/
├── HeroSection.tsx       # <section id="hero">, layout, mounts everything
├── HeroCanvas.tsx        # next/dynamic-loaded R3F <Canvas>, ssr:false
├── ParticleField.tsx     # the 1600-point shaderMaterial mesh + morph logic
├── ConnectionLines.tsx   # nearest-neighbor line segments
├── HeroContent.tsx       # badge/title/subtitle/CTA — Motion stagger
└── ScrollIndicator.tsx   # bottom "SCROLL" pill
```

## `HeroSection.tsx`

```tsx
'use client';
import { useRef } from 'react';
import HeroCanvas from './HeroCanvas';
import HeroContent from './HeroContent';
import ScrollIndicator from './ScrollIndicator';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <HeroCanvas sectionRef={sectionRef} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-bg/40 to-bg" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[.04] blur-[100px]" />
      <HeroContent />
      <ScrollIndicator />
    </section>
  );
}
```

`sectionRef` is passed down so the scroll-progress hook can measure `offsetHeight` of *this* section specifically — matching the original's `document.getElementById('hero').offsetHeight` (line 751), rather than hardcoding a viewport-height assumption.

## `HeroCanvas.tsx` — why dynamic import

R3F's `<Canvas>` touches `window`/WebGL context at mount time, which breaks SSR. Load it client-only with a lightweight loading state:

```tsx
'use client';
import dynamic from 'next/dynamic';
import type { RefObject } from 'react';

const CanvasInner = dynamic(() => import('./CanvasInner'), { ssr: false });

export default function HeroCanvas({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  return (
    <div className="absolute inset-0 z-0">
      <CanvasInner sectionRef={sectionRef} />
    </div>
  );
}
```

`CanvasInner.tsx` (co-located, not exported elsewhere) holds the actual `<Canvas>`:

```tsx
import { Canvas } from '@react-three/fiber';
import ParticleField from './ParticleField';
import ConnectionLines from './ConnectionLines';

export default function CanvasInner({ sectionRef }) {
  return (
    <Canvas
      camera={{ fov: 55, position: [0, 0, 6], near: 0.1, far: 500 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContent sectionRef={sectionRef} />
    </Canvas>
  );
}
```

`dpr={[1, 2]}` is R3F's built-in equivalent of the original's manual `Math.min(window.devicePixelRatio, 2)` (line 447) — no need to hand-roll it.

## `ParticleField.tsx` — the core conversion

### Buffers (identical math to lines 462–497, computed once via `useMemo`)

- `N = 1600`
- `positions` (current, mutated every frame) — starts equal to `randPositions`
- `randPositions` — the "raw data" chaos target, `(Math.random()-.5)*14/14/10` per axis
- `gridPositions` — the structured grid target, same `gridSide = Math.ceil(Math.cbrt(N))` cube-packing math
- `sizes`, `colors` — same `lerpColors(dim, accent, Math.random()*0.35)` logic

```tsx
const N = 1600;

const { randPositions, gridPositions, sizes, colors } = useMemo(() => {
  const rand = new Float32Array(N * 3);
  const grid = new Float32Array(N * 3);
  const sz = new Float32Array(N);
  const col = new Float32Array(N * 3);
  const gridSide = Math.ceil(Math.cbrt(N));
  const accent = new THREE.Color('#c8ff00');
  const dim = new THREE.Color('#3a3a4a');

  for (let i = 0; i < N; i++) {
    // ... identical to xai.html lines 474-491
  }
  return { randPositions: rand, gridPositions: grid, sizes: sz, colors: col };
}, []);

const positions = useMemo(() => Float32Array.from(randPositions), [randPositions]);
```

### Shader material — use drei's `shaderMaterial` + `extend`, not raw `THREE.ShaderMaterial`

This is the actual "vanilla Three.js → R3F" swap the brief asks for: instead of `new THREE.ShaderMaterial({...})` imperatively, define a reusable, JSX-usable material once in `src/shaders/particleField.ts`:

```ts
// src/shaders/particleField.ts
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleFieldMaterial = shaderMaterial(
  { uDpr: 1, uMouse: new THREE.Vector2(), uTime: 0 },
  /* vertex */ `
    attribute float size; attribute vec3 aColor;
    varying vec3 vC; varying float vA;
    uniform float uDpr, uTime; uniform vec2 uMouse;
    void main() {
      vC = aColor;
      vec3 p = position;
      float md = length(p.xy - uMouse * 3.5);
      float mi = smoothstep(2.5, 0., md);
      p.xy += normalize(p.xy - uMouse * 3.5 + .001) * mi * .6;
      p.x += sin(uTime * .4 + position.y * 1.8) * .025;
      p.y += cos(uTime * .35 + position.x * 1.8) * .025;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = max(size * uDpr * (280. / -mv.z) * (1. + mi * .7), 1.);
      vA = smoothstep(0., .5, size / 3.) * (.55 + mi * .45);
    }
  `,
  /* fragment */ `
    varying vec3 vC; varying float vA;
    void main() {
      float d = length(gl_PointCoord - vec2(.5));
      if (d > .5) discard;
      float a = smoothstep(.5, .08, d) * vA;
      gl_FragColor = vec4(vC, a);
    }
  `
);

extend({ ParticleFieldMaterial });
```

The GLSL bodies are copied verbatim from `xai.html` lines 501–525 — the shader math doesn't need to change, only *how it's registered with Three.js* changes (declarative `<particleFieldMaterial>` JSX tag vs. imperative `new THREE.ShaderMaterial()`).

Add a TS module augmentation so JSX recognizes the new element:

```ts
declare module '@react-three/fiber' {
  interface ThreeElements {
    particleFieldMaterial: Object3DNode<ParticleFieldMaterial, typeof ParticleFieldMaterial>;
  }
}
```

### The component

```tsx
export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<any>(null);
  const heroProgress = useHeroScrollProgress(); // ref, see below
  const pointer = usePointer(); // ref, see plan 07

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const geo = pointsRef.current!.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const sp = 0.022;
    const p = heroProgress.current;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      for (const axis of [0, 1, 2]) {
        const target = randPositions[i3 + axis] + (gridPositions[i3 + axis] - randPositions[i3 + axis]) * p;
        pos[i3 + axis] += (target - pos[i3 + axis]) * sp;
      }
    }
    geo.attributes.position.needsUpdate = true;

    materialRef.current.uTime = t;
    materialRef.current.uMouse.set(pointer.current.x, pointer.current.y);

    pointsRef.current!.rotation.y = t * 0.04 + pointer.current.x * 0.12;
    pointsRef.current!.rotation.x = pointer.current.y * 0.06;
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
```

This is the single most important pattern in the whole rebuild: **the per-frame position lerp loop runs inside `useFrame`, mutating the typed array and setting `needsUpdate = true` directly** — exactly like the original's `requestAnimationFrame` loop (lines 563–587), just running inside R3F's render loop instead of a bare `rAF`. Nothing here becomes React state.

## `ConnectionLines.tsx`

Same idea as `updLines()` (lines 545–560): every 12th frame, sample 180 random nearby-particle pairs and rebuild a `LineSegments` position buffer. Port as a sibling component sharing the same `pointsRef`-equivalent access to the live position array (pass positions via a shared ref from the parent, or lift the geometry ref up to `ParticleField`'s parent and pass down — cleanest is a small context or just prop-drilling the ref one level since it's only 2 components deep).

```tsx
useFrame(() => {
  frameCount.current++;
  if (frameCount.current % 12 !== 0) return;
  const p = sourcePositions.current;
  for (let i = 0; i < LN; i++) {
    // identical nearest-of-18-random-samples logic, xai.html lines 548-559
  }
  lineGeo.current.attributes.position.needsUpdate = true;
});
```

Opacity: `.02 + heroProgress.current * .06`, matching line 584 — set via `<lineBasicMaterial opacity={...} />` updated in the same `useFrame`.

## Driving `heroProgress` from scroll

`heroP` in the original is a bare module variable updated by a global `scroll` listener (line 752) and read by the `rAF` loop. In React: a **ref**, not state (see plan 07's `useScrollProgress` hook), computed as `Math.min(scrollY / sectionEl.offsetHeight, 1)` — pass `sectionRef` down from `HeroSection` so this matches the original's per-section measurement rather than an arbitrary constant.

## `HeroContent.tsx` — Motion, not GSAP

The original's hero entrance (badge → title → subtitle → CTA → scroll indicator, staggered with `-=` overlaps, lines 780–787) is a one-time-on-mount timeline — a perfect fit for Motion's `variants` + `staggerChildren`, which is more idiomatic React than a GSAP timeline for a non-scroll-linked, mount-triggered sequence:

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.35 } },
};
const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

<motion.div variants={container} initial="hidden" animate="show" className="relative z-[2] ...">
  <motion.div variants={item}>{/* badge */}</motion.div>
  <motion.h1 variants={item}>{/* title */}</motion.h1>
  <motion.p variants={item}>{/* subtitle */}</motion.p>
  <motion.div variants={item}>{/* CTA buttons */}</motion.div>
</motion.div>
```

Content verbatim from lines 156–169: badge text "Now processing 2.4M data points per second", headline "From Raw Data" / gradient "to Intelligence" (`text-gradient-accent` from plan 01), subtitle, `Button` primary "Start Building" + secondary "Watch Demo".

## `ScrollIndicator.tsx`

Static markup from lines 170–175 (SCROLL label + pill with `animate-float-dot` from plan 01's globals). Fade in via the same Motion `item` variant, appended as a 5th staggered child, or a simple `initial/animate` with a delay — matches original's `.hero-scroll` being last in the timeline (line 787).

## Verification for this step

- Particle field renders as a diffuse cloud on load, and visibly tightens into a grid lattice as you scroll from `scrollY = 0` to `scrollY = heroSectionHeight`.
- Moving the mouse over the hero visibly pushes nearby particles away.
- No hydration warnings in console (confirms the dynamic-import/`ssr:false` boundary is correctly placed).
- Frame rate stays smooth (check DevTools Performance) — if it drops, confirm the position-array mutation is happening in `useFrame`, not accidentally triggering React re-renders.
