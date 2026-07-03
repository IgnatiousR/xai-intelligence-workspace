# 07 — Animation Strategy & Shared Hooks

This file is the cross-cutting reference the other plans point back to. Read it before implementing any section, since it defines *which tool handles which job* and the shared hooks every section depends on.

## Which animation tool for which job

The brief requires all three (Motion, GSAP, R3F/Three.js) to be used meaningfully — not decoratively. Here's the actual division of labor, derived from what each does *best* rather than using all three everywhere:

| Job | Tool | Why |
|---|---|---|
| Hero copy entrance (badge→title→subtitle→CTA stagger) | **Motion** | Mount-triggered, one-shot, declarative stagger — Motion's `variants` are the idiomatic React fit |
| Dashboard tab crossfade, sidebar active state | **Motion** | Discrete state transitions driven by `useState` — `AnimatePresence` handles enter/exit cleanly |
| Tab underline sliding between buttons | **Motion** | `layoutId` shared-element transition — no equivalent this clean in GSAP for React |
| Progress bar fill-in | **Motion** | Simple `animate={{ width }}` on state/mount change |
| Section header / stage block scroll-reveal | **GSAP + ScrollTrigger** | Position-in-viewport triggered, not state-driven — ScrollTrigger's `start`/`end` viewport-percentage triggers are purpose-built for this and match the original's exact thresholds (`top 82%`, `top 78%`, `top 72%`) |
| WOW-moment scroll-scrubbed morph progress | **GSAP ScrollTrigger (`scrub: true`)** | Needs a smooth 0–1 value tied to scroll position over a defined section range — ScrollTrigger's `scrub` is exactly this; recomputing it by hand (as the original does with a raw `scroll` listener) is what ScrollTrigger exists to replace |
| Hero particle field morph, WOW point cloud morph, all per-frame shader/position updates | **React Three Fiber `useFrame`** | Continuous, every-frame, GPU-bound — this is R3F/Three.js's job, not an animation library's |
| Stage canvases (ingest/analyze/insight), dashboard line charts | **Canvas2D + `requestAnimationFrame`** | Not 3D, not DOM — plain 2D drawing, kept as-is from the original since it's already the right tool |

**Rule of thumb applied throughout:** if a value changes every animation frame (particle positions, shader uniforms, scroll-scrubbed progress), it lives in a **ref** and is read imperatively. If a value changes on a discrete event (tab click, mount, viewport-enter), it can safely be **React/Motion state**.

## `lib/gsap.ts` — one-time registration

```ts
'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

Import `gsap`/`ScrollTrigger` from this file everywhere, never directly from the `gsap` package — guarantees registration happens exactly once and only client-side.

## `hooks/useGsapScrollTrigger.ts`

Thin wrapper around `@gsap/react`'s `useGSAP`, scoped to a single element ref, used by every section's entrance animation (SectionHeader, StageBlock, StageLine, DashboardWindow, WOW header/container):

```ts
'use client';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import type { RefObject } from 'react';

gsap.registerPlugin(useGSAP);

export function useGsapScrollTrigger(
  ref: RefObject<HTMLElement | null>,
  setup: (el: HTMLElement, gsap: typeof import('gsap').gsap) => void
) {
  useGSAP(() => {
    if (!ref.current) return;
    setup(ref.current, gsap);
  }, { scope: ref, dependencies: [ref] });
}
```

`useGSAP`'s built-in `gsap.context()` scoping means every tween/ScrollTrigger created inside `setup` is **automatically reverted on unmount** — this is the React-safety net the original never needed (static HTML never unmounts) but is essential here, especially under Strict Mode's mount→unmount→remount dev cycle, which would otherwise leave duplicate `ScrollTrigger` instances stacking up.

## `hooks/usePointer.ts`

Normalized (-1..1, Y-flipped to match WebGL convention) pointer position, read by both R3F shader uniforms — matches the original's two separate `mx,my` (hero, lines 540–541) and `wmx,wmy` (WOW, line 685) module variables, unified into one reusable hook with a container-scoping option:

```ts
'use client';
import { useRef, useEffect } from 'react';

export function usePointer(containerRef?: RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const target = containerRef?.current ?? window;
    const onMove = (e: MouseEvent) => {
      const rect = containerRef?.current?.getBoundingClientRect();
      const w = rect?.width ?? window.innerWidth;
      const h = rect?.height ?? window.innerHeight;
      const x = rect ? e.clientX - rect.left : e.clientX;
      const y = rect ? e.clientY - rect.top : e.clientY;
      pointer.current.x = (x / w) * 2 - 1;
      pointer.current.y = -(y / h) * 2 + 1;
    };
    target.addEventListener('mousemove', onMove as EventListener);
    return () => target.removeEventListener('mousemove', onMove as EventListener);
  }, [containerRef]);

  return pointer;
}
```

`ParticleField` calls `usePointer()` (whole-window, matches original hero behavior). `MorphingPointCloud` calls `usePointer(containerRef)` scoped to the WOW container (matches original's `wPar.addEventListener`, line 686).

## `hooks/useSectionScrollProgress.ts`

Generalizes the pattern from plan 06 (originally described there for the WOW section) into a reusable hook — also used by the Hero for `heroProgress`:

```ts
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import type { RefObject } from 'react';

export function useSectionScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
  options?: { extraScrollDistance?: number } // WOW needs +innerHeight*0.5, Hero needs 0
) {
  const progress = useRef(0);

  useGSAP(() => {
    if (!containerRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => `+=${containerRef.current!.offsetHeight + (options?.extraScrollDistance ?? 0)}`,
      scrub: true,
      onUpdate: (self) => { progress.current = self.progress; },
    });
    return () => trigger.kill();
  }, { scope: containerRef });

  return progress;
}
```

Hero usage: `useSectionScrollProgress(sectionRef)` — matches original's plain `sy / hh` (line 752, no extra distance).
WOW usage: `useSectionScrollProgress(containerRef, { extraScrollDistance: window.innerHeight * 0.5 })` — matches original's `-wr.top / (wr.height - innerHeight*.5)` (line 755).

## `hooks/useCanvasLoop.ts`

Defined in full in plan 04 — the shared Canvas2D `requestAnimationFrame` + `ResizeObserver` lifecycle used by the three stage-flow canvases. Referenced here for completeness of the hooks inventory.

## `hooks/useReducedMotion.ts`

Not present in the original at all beyond a blanket CSS media query (lines 118–120: forces all animation/transition durations to `.01ms`). That CSS rule alone **does not** stop the Three.js `requestAnimationFrame` loops or the canvas draw loops from running — it only kills CSS transitions/keyframes. Since this is a full rebuild, do better: actually gate the expensive per-frame work.

```ts
'use client';
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
```

Usage guidance (applied per-component, not globally):
- `CursorGlow`: don't mount the `mousemove` listener at all.
- `ParticleField` / `MorphingPointCloud`: still render (removing the 3D visuals entirely would be a worse experience than a static frame), but skip the continuous idle-motion terms (the `sin(uTime...)` ambient drift) — keep the scroll-driven morph and mouse-repel, since those are user-intent-driven, not ambient. Simplest correct implementation: just don't animate `uTime` forward (freeze it at 0), which kills the drift term but keeps everything else functional.
- GSAP entrance tweens: keep them, but shorten durations globally via `gsap.defaults({ duration: reduced ? 0.01 : undefined })` scoped per-context, or simply leave the existing CSS media-query kill-switch from plan 01 in place for these (it's sufficient for opacity/transform tweens, which is all the entrance animations are).

## Performance checklist (applies across plans 03–06)

- [ ] No `setState`/hooks-triggering-render inside any `useFrame` or `requestAnimationFrame` callback except the intentionally-throttled `WowOverlay` sync (plan 06), and even that should be rounded/debounced.
- [ ] All typed-array buffers (`Float32Array` position/color/size arrays) built with `useMemo(() => ..., [])` — never recreated on re-render.
- [ ] Every `useEffect`/`useFrame`/`ScrollTrigger` that allocates a listener, `rAF`, or GSAP instance has a matching cleanup path (`useGSAP`'s auto-revert covers GSAP; manual `cancelAnimationFrame`/`removeEventListener` for the rest).
- [ ] Both R3F `<Canvas>` mounts (`HeroCanvas`, `WowCanvas`) are `next/dynamic` with `ssr: false`.
- [ ] `<Canvas dpr={[1, 2]}>` is set on both — don't let devicePixelRatio go uncapped on high-DPI displays, exactly as the original manually capped it (line 447).
