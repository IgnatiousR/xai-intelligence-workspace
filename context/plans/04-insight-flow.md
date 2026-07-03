# 04 — Insight Flow Section

Maps to `xai.html` lines 179–250 (markup) + 917–1064 (the three Canvas2D IIFEs) + relevant GSAP blocks at 790–799.

## Component breakdown

```
insight-flow/
├── InsightFlowSection.tsx
├── StageBlock.tsx           # reusable card+copy layout, `reversed` prop
├── StageLine.tsx            # vertical gradient connector
└── canvases/
    ├── IngestCanvas.tsx
    ├── AnalyzeCanvas.tsx
    └── InsightCanvas.tsx
```

## `InsightFlowSection.tsx`

```tsx
<section id="flow" className="relative px-6 py-28 sm:py-36">
  <div className="mx-auto max-w-6xl">
    <SectionHeader
      label="How It Works"
      title={<>Three stages of<br />intelligent transformation</>}
      className="mb-20 sm:mb-28"
    />
    <div className="relative">
      <StageLine />
      <StageBlock index="01" title="Ingest Data" body="..." tags={[...]} canvas={<IngestCanvas />} />
      <StageBlock index="02" title="Analyze with AI" body="..." tags={[...]} canvas={<AnalyzeCanvas />} reversed />
      <StageBlock index="03" title="Generate Insight" body="..." tags={[...]} canvas={<InsightCanvas />} last />
    </div>
  </div>
</section>
```

Copy/tags pulled verbatim from lines 196–241 into `data/stages.ts` (see plan 08) — `InsightFlowSection` should just `.map()` over that array rather than hardcode 3 near-identical JSX blocks. Example:

```tsx
{stages.map((stage, i) => (
  <StageBlock key={stage.index} {...stage} reversed={i === 1} last={i === stages.length - 1} />
))}
```

## `StageBlock.tsx`

Props: `index: string`, `title: string`, `body: string`, `tags: string[]`, `canvas: React.ReactNode`, `reversed?: boolean`, `last?: boolean`.

Layout logic ports the original's `lg:order-1`/`lg:order-2` swap (lines 213–217) via a conditional on `reversed`:

```tsx
<div className={cn('stage-blk', !last && 'mb-16 lg:mb-28')}>
  <div className="items-center lg:grid lg:grid-cols-2 lg:gap-14">
    <div className={cn('mb-8 lg:mb-0', reversed ? 'order-1 lg:order-2 lg:pl-4' : 'lg:pr-4 lg:text-right')}>
      <span className="font-display text-6xl font-bold leading-none text-accent/15">{index}</span>
      <h3 className="mb-3 mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
      <p className="text-[15px] leading-relaxed text-fg-m">{body}</p>
      <div className={cn('mt-5 flex flex-wrap gap-1.5', !reversed && 'lg:justify-end')}>
        {tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
    </div>
    <div className={cn(reversed && 'order-2 lg:order-1', 'sc rounded-2xl border border-bdr bg-card p-5 border-gradient-hover')}>
      <div className="aspect-video overflow-hidden rounded-xl bg-bg-el">{canvas}</div>
    </div>
  </div>
</div>
```

`sc` hover treatment (`border-color` + `box-shadow` on `:hover`, lines 83–84 in the original CSS) — add as a small utility class in `globals.css` next to `.border-gradient-hover`, or inline as `hover:border-accent/25 hover:shadow-[0_8px_40px_rgba(200,255,0,0.06)] transition-all duration-400`. Prefer the inline Tailwind form since it's specific to this one component.

**Entrance animation**: GSAP ScrollTrigger, not Motion — this is a scroll-position-triggered (not mount-triggered) fade+rise, matching the original's per-block `ScrollTrigger` (lines 796–799: `trigger: b, start: 'top 78%'`). Use the `useGsapScrollTrigger` hook from plan 07:

```tsx
const ref = useRef<HTMLDivElement>(null);
useGsapScrollTrigger(ref, (el, gsap) => {
  gsap.set(el, { y: 40, opacity: 0 });
  gsap.to(el, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 78%' } });
});
```

## `StageLine.tsx`

The vertical connector (line 189, animated at 793–794): `absolute left-1/2 -translate-x-1/2 inset-y-0 w-px hidden lg:block`, gradient background `linear-gradient(to bottom, rgba(200,255,0,.35), rgba(200,255,0,.06), transparent)`. GSAP reveal: `gsap.set(el, {scaleY: 0, transformOrigin: 'top center'})` → `gsap.to(el, {opacity: 1, scaleY: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: {trigger: el, start: 'top 72%'}})`.

## The three Canvas2D visualization components

All three follow an identical structural pattern — a canvas ref, a resize-aware sizing function, and an internal `requestAnimationFrame` loop — so **extract a shared hook** rather than repeating the boilerplate three times:

### `hooks/useCanvasLoop.ts` (referenced here, defined in plan 07)

```ts
function useCanvasLoop(draw: (ctx: CanvasRenderingContext2D, cw: number, ch: number, dt: number) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let cw = 0, ch = 0, raf: number;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      if (Math.abs(r.width - cw) < 1 && Math.abs(r.height - ch) < 1) return;
      cw = r.width; ch = r.height;
      canvas.width = cw * d; canvas.height = ch * d;
      ctx.scale(d, d);
    };

    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      resize();
      if (!cw) return;
      draw(ctx, cw, ch, (now - last) / 1000);
      last = now;
    };
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [draw]);
  return canvasRef;
}
```

This replaces each canvas's hand-rolled `resize()` (called every frame with an early-exit diff check, e.g. lines 926–931) with a `ResizeObserver` + the same diff-guarded per-frame check — belt and suspenders, since layout can also change from GSAP animations, not just window resize. Cleanup (`cancelAnimationFrame`, disconnect observer) is the critical addition the original never needed (no unmount in a static HTML page) but is required in React.

### `IngestCanvas.tsx`

State (`streams[]` with position/velocity/trail) lives in a `useRef` initialized once (14 particles, `xai.html` lines 933–935), **not** `useMemo`/`useState` — it's mutated every frame. The `draw` callback passed to `useCanvasLoop` contains the exact per-frame logic from lines 937–959: attraction toward `(cw*.68, cw*.5)`, respawn-on-arrival, trail push/shift, center glow gradient.

```tsx
export default function IngestCanvas() {
  const streamsRef = useRef(/* init 14 streams, lines 933-935 */);
  const draw = useCallback((ctx, cw, ch) => {
    // body ported verbatim from xai.html lines 940-958, reading/writing streamsRef.current
  }, []);
  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
```

### `AnalyzeCanvas.tsx`

Neural network graph, lines 963–1003. `nodes`/`conns` built once per resize (the `built` flag guards against rebuilding every frame — keep this exact guard, it's important for perf) inside a ref. Layer config `[4,6,8,6,3]`, stochastic signal firing (`Math.random() < .06`), activation propagation — port verbatim into the `draw` callback.

### `InsightCanvas.tsx`

Insight-card cycling, lines 1006–1064. The `ins[]` array (5 canned insight strings with `type: 'critical'|'insight'|'auto'`) moves to `data/stages.ts` or stays local — it's presentation-only mock data specific to this canvas, so keeping it co-located in the component is fine (contrast with dashboard mock data, which is shared across multiple components and belongs in `data/dashboard.ts`). Port the grid background, card cycling timer (`timer > 2.2` → advance), and pulsing output-icon logic verbatim.

## Verification for this step

- All three canvases render inside their stage cards and animate continuously without dropped frames.
- Resizing the browser window doesn't distort or blur the canvases (confirms DPR scaling survives `ResizeObserver` resize).
- Navigating away from the page (or in dev, triggering Fast Refresh) doesn't leave orphaned `rAF` loops running — check via a `console.log` in the draw function that it stops after unmount.
- Scrolling the stage blocks into view triggers the fade/rise at the same `78%`/`72%` viewport thresholds as the original.
