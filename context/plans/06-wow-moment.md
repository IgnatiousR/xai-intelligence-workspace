# 06 — WOW Moment (Signature Interaction)

Maps to `xai.html` lines 409–426 (markup) + 592–746 (Three.js logic) + 812–815 (GSAP entrance) + 749–763 (scroll-driven state). This is the "one deliberate, impressive interaction" the brief calls for — a 700-node point cloud that morphs `sphere → cube surface → torus knot → sphere` as you scroll through the section, with real-time mouse repulsion and dynamically reconnecting nearest-neighbor lines.

## Component breakdown

```
wow-moment/
├── WowSection.tsx
├── WowCanvas.tsx           # dynamic-imported R3F <Canvas>, mirrors HeroCanvas
├── MorphingPointCloud.tsx  # R3F points, the morph shader + logic
└── WowOverlay.tsx          # DOM overlay: state label + progress bar (NOT in the R3F scene)
```

Structurally this is the same dynamic-import pattern as the Hero (plan 03) — same reasoning, same `ssr: false` boundary — so this file focuses on what's *different*: three morph targets instead of two, and a DOM overlay that needs to read the same scroll-progress value the 3D scene uses.

## `WowSection.tsx`

```tsx
'use client';
import { useRef } from 'react';

export default function WowSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="wow" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[.025] blur-[180px]" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          label="Interactive Experience"
          title="Watch intelligence emerge"
          subtitle="Move your cursor to shape the data. Scroll to transform chaos into structure."
          className="mb-10"
        />
        <div ref={containerRef} className="relative h-[560px] overflow-hidden rounded-2xl border border-bdr bg-card/40 backdrop-blur-sm">
          <WowCanvas containerRef={containerRef} />
          <WowOverlay containerRef={containerRef} />
        </div>
      </div>
    </section>
  );
}
```

Both `WowCanvas` (the R3F scene, reading scroll progress to drive the morph) and `WowOverlay` (the DOM label/progress-bar) need the *same* scroll-progress value the original computes once and shares via two `getElementById` calls (lines 754–762: `wowP` computed from the container's `getBoundingClientRect()`, then written to both the Three.js loop and 3 DOM nodes). In React, don't compute this twice — lift it into a shared hook and pass the resulting ref/value to both children. See "Sharing scroll progress" below.

## `MorphingPointCloud.tsx`

### Morph target buffers (`useMemo`, once) — identical math to lines 610–636

Three target arrays, each `Float32Array(700 * 3)`:

- **`sphereTargets`** — Fibonacci sphere distribution (`phi`/`theta` golden-angle spiral, radius 2.3)
- **`cubeTargets`** — random point projected onto a cube surface (normalize by max-axis, scale 1.9)
- **`torusTargets`** — torus knot parametric curve (`tr2=1.7, tu≈.55-.65, tw=3`, 5 winds)

Plus `sizes` and `colors` (lerp accent→white, up to 55%), all built once in a single `useMemo` block ported verbatim from lines 610–636.

### Shader material — same drei `shaderMaterial` pattern as the Hero (plan 03)

`src/shaders/morphCloud.ts`, structurally identical approach to `particleField.ts` but with the WOW-specific vertex/fragment bodies (lines 645–671): stronger mouse-repel (`push`), a subtle radial pulsing (`sin(uTime*.7 + length(p)*2.)*.03`), and a fragment shader with a soft outer glow + brighter core (`mix(vC, vec3(1.), core*.35)`) — a slightly hotter/glowier look than the Hero's particles, intentional per the original.

```ts
export const MorphCloudMaterial = shaderMaterial(
  { uDpr: 1, uTime: 0, uMouse: new THREE.Vector2() },
  /* vertex */ `...`,   // xai.html lines 646-660, verbatim
  /* fragment */ `...`  // xai.html lines 661-670, verbatim
);
```

### The morph itself — segment the 0→1 scroll progress into three legs

This is the one piece of logic worth calling out precisely, since it's the "trick" of the whole interaction (lines 716–732):

```tsx
useFrame(() => {
  const wowP = wowProgress.current; // 0..1, see "Sharing scroll progress" below
  const pos = geo.attributes.position.array as Float32Array;
  const sp = 0.035;

  for (let i = 0; i < WN; i++) {
    const i3 = i * 3;
    let tx: number, ty: number, tz: number;

    if (wowP < 0.33) {
      const f = wowP / 0.33;
      tx = lerp(sphereTargets[i3], cubeTargets[i3], f);
      ty = lerp(sphereTargets[i3 + 1], cubeTargets[i3 + 1], f);
      tz = lerp(sphereTargets[i3 + 2], cubeTargets[i3 + 2], f);
    } else if (wowP < 0.66) {
      const f = (wowP - 0.33) / 0.33;
      tx = lerp(cubeTargets[i3], torusTargets[i3], f);
      // ...
    } else {
      const f = (wowP - 0.66) / 0.34;
      tx = lerp(torusTargets[i3], sphereTargets[i3], f);
      // ...
    }

    pos[i3]     += (tx - pos[i3]) * sp;
    pos[i3 + 1] += (ty - pos[i3 + 1]) * sp;
    pos[i3 + 2] += (tz - pos[i3 + 2]) * sp;
  }
  geo.attributes.position.needsUpdate = true;
  // + rotation, uniforms — same shape as ParticleField's useFrame
});
```

`wowProgress` is a **ref**, exactly like `heroProgress` in plan 03 — never state, since this runs every frame.

### Connection lines

`WLN = 250` nearest-neighbor segments, recomputed every 10th frame, distance threshold `1.1` (vs. the Hero's `1.3`) — same pattern as `ConnectionLines.tsx` from plan 03. Given the near-identical structure between the Hero's and WOW's connection-line logic (both: sample-N-random-pairs-find-nearest, rebuild a `LineSegments` buffer every K frames), consider factoring a **shared generic hook**:

```ts
// hooks/useNearestNeighborLines.ts
function useNearestNeighborLines(sourcePositions: RefObject<Float32Array>, count: number, sampleCount: number, threshold: number, everyNFrames: number) {
  // returns a ref to the line-segment position buffer, updates it in an internal useFrame
}
```

Used by both `ConnectionLines.tsx` (Hero) and a `WowConnectionLines.tsx` (WOW) with different `count`/`threshold` args — this is the kind of duplication worth collapsing since the two original IIFEs (lines 545–560 and 688–703) are copy-pasted with only constants changed.

## Sharing scroll progress between the R3F scene and the DOM overlay

The original computes `wowP` once per scroll event and fans it out to: the Three.js `wLoop` (module variable read), plus three `document.getElementById` DOM writes (`wow-bar` width, `wow-pct` text, `wow-label` text). We need one source of truth read by two different rendering systems (R3F's imperative `useFrame` and React's declarative DOM).

**Approach: a shared ref + a GSAP ScrollTrigger `onUpdate`, with the DOM overlay subscribing via a lightweight rAF-throttled state sync — not a raw scroll listener duplicated in two places.**

```ts
// hooks/useSectionScrollProgress.ts
function useSectionScrollProgress(containerRef: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useGSAP(() => {
    if (!containerRef.current) return;
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => `+=${containerRef.current!.offsetHeight + window.innerHeight * 0.5}`,
      scrub: true,
      onUpdate: (self) => { progress.current = self.progress; },
    });
  }, [containerRef]);

  return progress; // a ref — R3F reads it directly in useFrame
}
```

`MorphingPointCloud` reads `progress.current` directly every `useFrame` tick — no re-render cost, matches the original's per-frame read exactly.

`WowOverlay` (plain DOM, needs to actually re-render text/width on change) samples the *same* ref on a throttled interval instead of re-subscribing to scroll itself:

```tsx
// WowOverlay.tsx
const [displayProgress, setDisplayProgress] = useState(0);

useEffect(() => {
  let raf: number;
  const sync = () => {
    setDisplayProgress(progress.current);
    raf = requestAnimationFrame(sync);
  };
  raf = requestAnimationFrame(sync);
  return () => cancelAnimationFrame(raf);
}, [progress]);
```

This does mean `WowOverlay` re-renders every animation frame while the section is in view — acceptable because it's a tiny, isolated leaf component (a percentage number, a label string, and a bar width), not the whole tree. If profiling shows this is too aggressive, throttle `sync` to only call `setDisplayProgress` when the rounded percentage actually changes (`Math.round(progress.current * 100) !== Math.round(displayProgress * 100)`), which matches the *visual* granularity of the original anyway (it displays whole percentages).

## `WowOverlay.tsx`

```tsx
<div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
  <div>
    <div className="mb-0.5 text-[10px] uppercase tracking-wide text-fg-m">Current State</div>
    <div className="font-display text-base font-semibold">{stateLabel}</div>
  </div>
  <div className="text-right">
    <div className="mb-1 text-[10px] text-fg-m">Scroll to transform</div>
    <div className="flex items-center gap-2">
      <div className="h-1 w-28 overflow-hidden rounded-full bg-bg-el">
        <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-display text-[11px] font-medium text-accent">{pct}%</span>
    </div>
  </div>
</div>
```

`stateLabel` = `progress < 0.33 ? 'Raw Data' : progress < 0.66 ? 'Structured Grid' : 'Intelligence Network'` — identical thresholds to line 762.

## Entrance animation

`.wow-hdr`/`.wow-ctr` fade+rise on scroll-into-view (lines 812–815) — same `useGsapScrollTrigger` pattern as every other section header, nothing new here.

## Verification for this step

- Scrolling through the WOW section morphs the point cloud through all three shapes and the label/percentage/bar update in lockstep with the 3D shape — no visible lag between the two.
- Moving the mouse inside the canvas repels nearby points in real time.
- The connection lines reconnect dynamically rather than staying static.
- Scrolling quickly (flinging) doesn't desync the DOM overlay from the 3D scene — if it does, lower the rAF-throttle threshold in `WowOverlay`'s sync logic.
- No layout shift or WebGL context flicker when the section scrolls in/out of the viewport (dynamic import + `ssr:false` should prevent any hydration mismatch here, same as the Hero).
