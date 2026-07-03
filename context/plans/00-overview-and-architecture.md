# 00 — Overview & Architecture

## What we're converting

`xai.html` is a single 1067-line static file: Tailwind via CDN, vanilla Three.js (two WebGL scenes hand-rolled with raw `ShaderMaterial`), GSAP + ScrollTrigger for entrance/scroll reveals, and four independent `requestAnimationFrame` Canvas2D loops for the dashboard charts and stage visualizations. Everything is wired together with `document.querySelectorAll` and manual class toggling.

The goal is a **Next.js 16 (App Router, `src/` directory) rebuild** that is fully component-based, with:

- **React Three Fiber (`@react-three/fiber`) + `@react-three/drei`** replacing raw Three.js for both the Hero particle field and the WOW-moment morphing point cloud.
- **GSAP + ScrollTrigger** for scroll-scrubbed / staggered reveals (kept, because R3F doesn't replace this — it replaces the *raw WebGL setup*, not the scroll choreography).
- **Motion (Framer Motion)** for UI-level entrance choreography and state-driven transitions (hero copy stagger, tab crossfades, sidebar active state).
- **Tailwind CSS v4** (CSS-first config via `@theme`, no `tailwind.config.js` colors block).
- Canvas2D visualizations (ingest/analyze/insight stage canvases, the two dashboard line charts) stay as Canvas2D — that's the right tool for those, R3F would be overkill — but each becomes an isolated, self-cleaning component instead of an IIFE.

## Guiding principles for every plan file in this set

1. **One concern per component.** Nothing in the original `<script>` blocks should survive as one giant blob — each visual system (hero particles, stage canvas, dashboard chart, morph cloud) becomes its own client component with its own lifecycle.
2. **No `setState` inside animation loops.** The original code mutates DOM/canvas directly every frame. In React, per-frame mutation must stay in refs/uniforms/canvas contexts — never in `useState`, or you'll cause 60fps re-renders. This is called out explicitly in each relevant plan file.
3. **Scroll-driven values are refs, not props.** `heroP` and `wowP` (0→1 progress floats) currently live as bare module-scope variables read inside `requestAnimationFrame`. In React they become refs updated by a GSAP ScrollTrigger `onUpdate`, read by `useFrame` — never React state, since state would re-render the whole tree every scroll pixel.
4. **Client components are explicit.** Any component touching `window`, Canvas2D, WebGL, or GSAP gets `'use client'` and, for the two R3F canvases, is loaded via `next/dynamic` with `ssr: false`.
5. **Design tokens live in one place** (`globals.css` `@theme`), never re-typed as hex strings in components — mirrors the Figma spec's "color styles" requirement from `design_xai.md`.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, metadata, <html>/<body>, global providers
│   ├── page.tsx                 # composes the 5 sections in order
│   └── globals.css              # Tailwind v4 @import + @theme tokens + noise/scrollbar/etc.
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── CursorGlow.tsx
│   │
│   ├── hero/
│   │   ├── HeroSection.tsx          # section wrapper, orchestrates children
│   │   ├── HeroCanvas.tsx           # dynamic-imported R3F <Canvas>
│   │   ├── ParticleField.tsx        # R3F points + custom shaderMaterial
│   │   ├── ConnectionLines.tsx      # R3F line segments, recomputed on interval
│   │   ├── HeroContent.tsx          # badge/title/subtitle/CTA, Motion stagger
│   │   └── ScrollIndicator.tsx
│   │
│   ├── insight-flow/
│   │   ├── InsightFlowSection.tsx
│   │   ├── StageBlock.tsx           # reusable, `reversed` prop
│   │   ├── StageLine.tsx            # vertical connector, GSAP scaleY reveal
│   │   └── canvases/
│   │       ├── IngestCanvas.tsx
│   │       ├── AnalyzeCanvas.tsx
│   │       └── InsightCanvas.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardSection.tsx
│   │   ├── DashboardWindow.tsx      # title bar + frame chrome
│   │   ├── Sidebar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── TabBar.tsx
│   │   ├── tabs/
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── AnalyticsTab.tsx
│   │   │   └── RecentTab.tsx
│   │   ├── charts/
│   │   │   └── LineChart.tsx        # shared canvas chart, data-driven (replaces 2 near-duplicate draw fns)
│   │   ├── ProgressBar.tsx
│   │   ├── InsightRow.tsx
│   │   └── DataTable.tsx
│   │
│   ├── wow-moment/
│   │   ├── WowSection.tsx
│   │   ├── WowCanvas.tsx            # dynamic-imported R3F <Canvas>
│   │   ├── MorphingPointCloud.tsx   # R3F points, sphere↔cube↔torusKnot
│   │   └── WowOverlay.tsx           # state label + progress bar (DOM, not R3F)
│   │
│   └── ui/
│       ├── Button.tsx               # primary/secondary/ghost variants
│       ├── Tag.tsx
│       └── SectionHeader.tsx        # label + H2 + subtitle, used 3x in original
│
├── hooks/
│   ├── useGsapScrollTrigger.ts      # gsap.context wrapper, SSR/StrictMode-safe
│   ├── useScrollProgress.ts         # generic 0–1 scroll-fraction-of-element hook
│   ├── usePointer.ts                # normalized (-1..1) pointer position ref
│   └── useReducedMotion.ts          # prefers-reduced-motion → disable heavy loops
│
├── lib/
│   ├── gsap.ts                      # registerPlugin(ScrollTrigger) once, client-only
│   └── cn.ts                        # tiny classnames helper
│
├── shaders/
│   ├── particleField.ts             # vertex/fragment strings, hero
│   └── morphCloud.ts                # vertex/fragment strings, wow moment
│
└── data/
    ├── nav.ts
    ├── stages.ts                    # copy for the 3 insight-flow stages
    └── dashboard.ts                 # metrics, insights, table rows, model perf
```

## Section → component map (traceability)

| `xai.html` section | Lines | New component(s) |
|---|---|---|
| `<nav>` | 128–147 | `layout/Navbar.tsx` |
| `#cursor-glow` | 125 | `layout/CursorGlow.tsx` |
| `#hero` + `#hero-canvas` + hero `<script type="module">` block | 150–177, 453–587 | `hero/*` (5 components) |
| `#flow` (3 stage blocks) | 180–250 | `insight-flow/*` |
| `#c-ingest`/`#c-analyze`/`#c-insight` canvas IIFEs | 917–1064 | `insight-flow/canvases/*` |
| `#dashboard` mock UI | 253–407 | `dashboard/*` |
| `drawMainChart`/`drawAccChart` | 846–913 | `dashboard/charts/LineChart.tsx` (unified) |
| `#wow` + `#wow-canvas` + wow `<script type="module">` block | 409–426, 592–746 | `wow-moment/*` |
| `<footer>` | 429–440 | `layout/Footer.tsx` |
| All `gsap.*` scroll reveals | 776–843 | distributed into each section's own `useGsapScrollTrigger` call — no central "god script" |

## Read order for the rest of this plan set

1. `01-setup-and-design-system.md` — scaffold the project, Tailwind v4 tokens, base UI primitives
2. `02-layout-shell.md` — root layout, nav, footer, cursor glow
3. `03-hero-section.md` — R3F particle field
4. `04-insight-flow.md` — stage blocks + Canvas2D visualizations
5. `05-dashboard-preview.md` — the mock product UI
6. `06-wow-moment.md` — R3F morphing point cloud (the signature interaction)
7. `07-animation-strategy-and-hooks.md` — cross-cutting GSAP/Motion/R3F rules and the shared hooks
8. `08-mock-data-and-content.md` — typed content files
9. `09-polish-performance-deploy.md` — a11y, perf budget, README, Vercel deploy checklist
