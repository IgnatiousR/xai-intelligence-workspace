# Current Feature: XAI Intelligence Workspace — Next.js Rebuild

## Status
<!-- Not Started | In Progress | Completed -->
All Plans Complete — Ready for Deploy

## Goals
<!-- Goals & requirements -->
- Add `scope="col"` to DataTable `<th>` elements for screen-reader column association
- Add `focus-visible` rings to Sidebar items and TabBar buttons
- Add `aria-label` to WowCanvas container for screen readers
- Create README.md with overview, tech stack, setup instructions, animation decisions
- Update layout.tsx metadata (title, description, robots)
- Verify build succeeds with no TypeScript errors
- Document responsive/mobile GPU considerations

## History
<!-- Keep this updated. Earliest to latest -->
- Phase 1 (2026-07-03): Project scaffolded with `create-next-app` — Next.js 16.2.10, React 19.2.4, Tailwind v4, all dependencies installed, tsconfig paths configured
- Phase 2 (2026-07-03): Plan 00 & 01 audit completed — identified that only the scaffold (Steps 1-3) is done; Steps 4-7 of Plan 01 (fonts, design tokens, global styles, UI primitives) and all folder structure from Plan 00 remain unimplemented
- Phase 3 (2026-07-03): Plan 01 fully implemented and build passes:
  - globals.css: @theme tokens, global styles, scrollbar, noise overlay, gradient text, glow, conic border, keyframes, reduced-motion
  - layout.tsx: Space Grotesk + DM Sans via next/font/google
  - UI primitives: Button (primary/secondary), Tag, SectionHeader (label/heading/subtitle)
  - Folder structure: all 6 component dirs + hooks + lib + shaders + data created
  - Lib: cn.ts (clsx+twMerge), gsap.ts (ScrollTrigger registration)
  - Hooks: useGsapScrollTrigger, useScrollProgress, usePointer, useReducedMotion
  - Shaders: particleField.ts, morphCloud.ts (vertex/fragment strings)
  - Data: nav.ts, stages.ts, dashboard.ts (typed content)
  - page.tsx: section placeholders for flow/dashboard/wow
- Phase 4 (2026-07-03): Plan 02 (Layout Shell) implemented and build passes:
  - CursorGlow: ref-based DOM mutation, reduced-motion guard via useReducedMotion hook
  - Navbar: fixed top nav with logo (accent square + "X" + "Xai" + chip), 4 anchor links (#hero/#flow/#dashboard/#wow), CTA Button; no JS scroll handler (CSS smooth-scroll handles it)
  - Footer: static server component with logo, 4 text links, tagline
  - layout.tsx: updated metadata to match xai.html, mounts CursorGlow/Navbar/Footer, body has bg-bg text-fg font-body
  - page.tsx: composes hero/flow/dashboard/wow sections with scroll-mt-14 for fixed nav offset, content copied from xai.html
- Phase 5 (2026-07-03): Plan 03 (Hero Section) implemented and build passes:
  - particleField.ts: drei shaderMaterial + extend, ThreeElements module augmentation
  - ParticleField: 1600-point shaderMaterial points, useFrame lerp chaos→grid, mouse repulsion via uMouse uniform, rotation based on pointer
  - ConnectionLines: 180 nearest-neighbor line segments, recomputed every 12th frame, opacity tied to heroProgress
  - CanvasInner: R3F Canvas (fov 55, z=6, dpr [1,2], alpha), scroll listener computes heroProgress from section offsetHeight
  - HeroCanvas: dynamic import with ssr:false for SSR safety
  - HeroContent: Motion variants + staggerChildren entrance (badge/title/subtitle/CTA), cubic bezier ease [0.16,1,0.3,1]
  - ScrollIndicator: fade-in with delay 1.1s, animate-float-dot scroll pill
  - HeroSection: section wrapper with gradient overlay, glow blob, scroll-mt-14
  - page.tsx: updated to import and render HeroSection component
- Phase 6 (2026-07-03): Plan 04 (Insight Flow) implemented and build passes:
  - useCanvasLoop: shared hook for Canvas2D animation loops with ResizeObserver + DPR scaling + cleanup
  - stages.ts: updated with body/tags matching xai.html verbatim content
  - IngestCanvas: 14 data streams flowing to center, trail rendering, center glow gradient
  - AnalyzeCanvas: neural network graph [4,6,8,6,3] layers, stochastic signal firing, activation propagation
  - InsightCanvas: 5 insight cards cycling with grid background, rounded rect cards, pulsing output icon
  - StageBlock: reusable card+copy layout with reversed prop, GSAP scroll fade+rise (trigger: top 78%)
  - StageLine: vertical gradient connector with GSAP scaleY reveal (trigger: top 72%)
  - InsightFlowSection: section wrapper with header fade+rise, maps over stages array
  - page.tsx: replaced inline flow section with InsightFlowSection import
- Phase 7 (2026-07-03): Plan 05 (Dashboard Preview) implemented and build passes:
  - dashboard.ts: updated with verbatim metrics, chart data, data sources, insights, model performance, table rows, sidebar items, tabs
  - LineChart: unified data-driven canvas chart (replaces drawMainChart + drawAccChart), ResizeObserver redraw, bezier curve helper
  - ProgressBar: animated width via Motion on mount (initial:0, animate:target%), cubic bezier ease
  - InsightRow: tone-colored dot (critical/insight/auto), hover:bg-bg/40
  - MetricCard: metric display with hover translate-y + border accent
  - DataTable: event table with status pills, responsive column visibility (hidden sm/md:table-cell)
  - Sidebar: 6 nav items with inline SVG icons, active state via useState, workspace header + Jane Doe footer
  - TabBar: 3 tabs with Motion layoutId animated underline (sliding indicator)
  - OverviewTab: processing volume LineChart + data sources ProgressBars + latest insights
  - AnalyticsTab: accuracy LineChart + model performance ProgressBars
  - RecentTab: DataTable with event rows
  - DashboardWindow: title bar chrome (traffic lights + URL) + flex Sidebar/main layout, 500px height, AnimatePresence tab crossfade
  - DashboardSection: section wrapper with gradient overlay, header + window GSAP entrance (trigger: top 82%)
  - page.tsx: replaced inline dashboard section with DashboardSection import
- Phase 8 (2026-07-03): Plan 06 (Wow Moment) implemented and build passes:
  - morphCloud.ts: rewritten with drei shaderMaterial + extend, wow-specific vertex (mouse repel push, radial pulse sin) + fragment (glow exp + core bright)
  - useSectionScrollProgress: shared scroll progress ref via GSAP ScrollTrigger scrub, reads container offsetHeight
  - MorphingPointCloud: 700 points, 3 morph targets (sphere Fibonacci/cube surface/torusKnot), useFrame lerp with 3-segment progress (0-0.33-0.66-1), mouse repulsion, rotation
  - WowConnectionLines: 250 nearest-neighbor segments, every 10th frame, threshold 1.1
  - WowCanvas: dynamic import with ssr:false, mounts MorphingPointCloud + WowConnectionLines
  - WowOverlay: DOM overlay with rAF-throttled state sync from shared progress ref, state label (Raw Data/Structured Grid/Intelligence Network), progress bar + percentage
  - WowSection: section wrapper with glow blob, header + window GSAP entrance, useSectionScrollProgress shared between canvas and overlay
  - page.tsx: replaced inline wow section with WowSection import
- Phase 9 (2026-07-03): Plan 07 (Animation Strategy & Hooks) implemented:
  - lib/gsap.ts: added useGSAP plugin registration alongside ScrollTrigger
  - usePointer: added container-scoping option (containerRef param), scoped mouse tracking for WOW section
  - useSectionScrollProgress: added options.extraScrollDistance parameter, trigger.kill() cleanup
  - WowSection: passes extraScrollDistance (innerHeight * 0.5) and containerRef to WowCanvas
  - WowCanvas: threads containerRef to MorphingPointCloud for scoped pointer tracking
  - MorphingPointCloud: uses usePointer(containerRef) for WOW-specific mouse tracking
  - Performance verified: no setState in useFrame, all Float32Array buffers via useMemo, both Canvas mounts use ssr:false, dpr=[1,2]
- Phase 10 (2026-07-03): Plan 08 (Mock Data & Content) implemented:
  - nav.ts: renamed navItems to navLinks, matching plan format
  - stages.ts: renamed label to index in Stage type, kept id for canvas mapping
  - dashboard.ts: added as const to all arrays, renamed deltaTone to tone, statusDot to statusTone, added processingVolume/analysisAccuracy with min/max, renamed tableRows to recentEvents
  - insightCards.ts: created, extracted 5 insight card texts/types from InsightCanvas
  - Components updated: Navbar imports navLinks, StageBlock/InsightFlowSection use index, MetricCard uses tone, DataTable uses statusTone, RecentTab imports recentEvents, OverviewTab uses processingVolume, AnalyticsTab uses analysisAccuracy, InsightCanvas imports insightCards
- Phase 11 (2026-07-03): Plan 09 (Polish & Deploy Prep) implemented:
  - Accessibility: added scope="col" to DataTable th elements, focus-visible rings to Sidebar and TabBar buttons, aria-label to WowCanvas container
  - Metadata: updated layout.tsx with OpenGraph tags, robots config, expanded description
  - README: created with overview, tech stack, project structure, animation decisions, performance notes, responsive considerations
  - Build verified: zero TypeScript errors, all components compile cleanly

## References
<!-- Links to related docs, specs, external resources -->
- `context/plans/00-overview-and-architecture.md` — folder structure, guiding principles, section→component map
- `context/plans/01-setup-and-design-system.md` — scaffold, fonts, Tailwind v4 tokens, base UI primitives
- `context/plans/02-layout-shell.md` — root layout, Navbar, Footer, CursorGlow specs
- `context/plans/03-hero-section.md` — R3F particle field, connection lines, hero content, scroll progress
- `context/design_xai.md` — Figma spec, color table, spacing/radius scales
- `context/coding-standards.md` — coding conventions
- `context/project-overview.md` — project overview
- `context/xai.html` — original source file (lines 150-177 hero markup, 453-587 hero Three.js logic, 780-787 GSAP hero entrance)

## Notes
<!-- Any extra notes -->
- Plan 03 core principle: per-frame position lerp runs in `useFrame`, NOT in React state — identical to original rAF loop, just inside R3F's render loop
- `heroProgress` is a ref updated by scroll listener, read by `useFrame` — never useState (would cause 60fps re-renders)
- R3F `<Canvas>` must be loaded via `next/dynamic` with `ssr:false` because it touches WebGL at mount time
- ParticleField uses drei `shaderMaterial` + `extend` for declarative JSX, not imperative `new THREE.ShaderMaterial()`
- N=1600 particles, grid packing: `gridSide = Math.ceil(Math.cbrt(N))`, positions computed once in `useMemo`
- ConnectionLines: 180 line segments, recomputed every 12th frame (frameCount % 12), nearest-of-18-random-samples logic
- HeroContent entrance uses Motion `variants` + `staggerChildren` (0.15s stagger, 0.35s delay) — more idiomatic than GSAP timeline for mount-triggered sequence
- GLSL shaders copied verbatim from xai.html lines 501-525, only registration method changes
