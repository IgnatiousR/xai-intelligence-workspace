# 09 — Polish, Accessibility, Performance & Deployment

Closing pass, mapped against the brief's actual evaluation criteria (`Frontend_Task_docx.md`, "Evaluation Criteria" section) and deliverables list.

## Accessibility pass

The original already does a few things right — carry these forward, don't regress:

- `aria-hidden` on the two decorative canvases (`hero-canvas`, and by extension `HeroCanvas`'s root) and on the badge dot / scroll indicator (lines 151, 156, 170).
- `role="navigation" aria-label="Main navigation"` on the nav (line 128) → keep on `Navbar`'s `<nav>`.
- `aria-label` on icon-only/ambiguous buttons (`Get Started` already has visible text, but the WOW canvas has `aria-label="Interactive 3D data visualization"` at line 419 — keep on `WowCanvas`'s container).
- `focus-visible` rings on all interactive elements (plan 01's `Button`, plus add to `Sidebar` items and `TabBar` buttons, which the original didn't give explicit focus styles beyond browser default — worth improving here since they're real `<button>`s now, not `<div onclick>`s as in the original).

Additional items the original *doesn't* handle, worth adding since this is being rebuilt properly:

- **Sidebar and TabBar should be real `<button>` elements** (plan 05 already specifies this), not `<div>`s with click handlers — the original uses clickable `<div>`s (lines 279, 334) with no keyboard affordance at all. This is a straightforward correctness upgrade, not scope creep.
- **Table semantics**: the Recent tab's table already uses proper `<table>/<thead>/<tbody>` (lines 392–400) — keep as-is, just ensure `<th scope="col">` is added for screen-reader column association (missing in the original).
- **Reduced motion**: covered fully in plan 07's `useReducedMotion` hook — actually pauses expensive loops, not just a CSS fallback.
- **Color contrast**: `--fg-m: #6e6e7a` on `--bg: #06060a` is the muted text color used extensively for body copy — spot-check this pairing against WCAG AA (4.5:1 for body text) before final polish; if it falls short, this is a design-token change to flag back against the Figma spec rather than a per-component fix.

## Performance budget

Given two live WebGL scenes plus five Canvas2D loops running simultaneously once fully scrolled, treat this as the primary technical risk for the "Motion & Interaction: smoothness & performance" evaluation line:

- [ ] Lighthouse Performance ≥ 90 on the deployed build (mobile + desktop).
- [ ] No R3F scene renders when its section is far outside the viewport — add an `IntersectionObserver`-gated pause (set a ref flag read at the top of `useFrame` to skip work, or use drei's `<PerformanceMonitor>`/visibility-based `frameloop="demand"` toggling on `<Canvas>` if traffic through the section is the concern) rather than the original's always-running loops (which is fine for a single-page demo but worth improving here).
- [ ] Confirm `dpr={[1, 2]}` is actually capping render resolution on a high-DPI test device — this is the single biggest GPU-cost lever for the particle scenes.
- [ ] Bundle-check: `three` + `@react-three/fiber` + `@react-three/drei` + `gsap` + `motion` is a meaningful bundle. Use `next build` output or `@next/bundle-analyzer` to confirm code-splitting is working — both `<Canvas>` boundaries (Hero, WOW) should appear as separate chunks thanks to `next/dynamic`, not inline in the main bundle.
- [ ] Fonts: confirm `next/font` is producing `font-display: swap` (default behavior) so text isn't blocked on font load.
- [ ] Images: brief has no raster images (everything is code-drawn), so no image-optimization work needed here — worth noting in the README as a deliberate choice ("no stock illustrations" requirement, satisfied structurally).

## Responsive behavior

The Figma spec is explicitly desktop-first with "responsive thinking as a plus" — the original HTML already carries real responsive classes throughout (`sm:`/`md:`/`lg:` breakpoints on hero type scale, dashboard sidebar (`hidden md:flex`), table columns (`hidden sm:table-cell`), stage-block grid collapse). Preserve every one of these breakpoints exactly as authored when porting classes — don't simplify them away for a "cleaner" component, since the responsive behavior is itself part of what's being evaluated.

One judgment call to make explicitly (flag it in the README): the two R3F canvases are expensive on mobile GPUs. Consider reducing particle counts (`N`, `WN`) below a `sm:` breakpoint via a `useMediaQuery`-style check, or capping `dpr` to `1` on mobile — this is a legitimate engineering decision to document, not a silent scope cut.

## README structure (per brief's deliverable #2)

```markdown
# Xai — Intelligence Workspace

## Overview
[2-3 sentences: what this is, the core narrative — raw data → intelligence → insight → automation]

## Tech Stack
Next.js 16 (App Router, src/) · TypeScript · Tailwind CSS v4 · React Three Fiber + drei ·
GSAP + ScrollTrigger · Motion (Framer Motion)

## Running locally
\`\`\`bash
npm install
npm run dev
\`\`\`

## Animation & Interaction Decisions
[Short explanation of the tool-split table from plan 07 — why Motion for X,
GSAP for Y, R3F for Z — this directly answers the brief's "explanation of key
animation and interaction decisions" requirement]

## Video Walkthrough
[Link to the Google Drive/YouTube video the brief requires]

## Live Deployment
[Vercel URL]
```

## Deployment (brief's deliverable #3)

```bash
npm run build   # verify zero errors/warnings locally first
vercel deploy --prod
```

Pre-deploy checklist:
- [ ] `npm run build` succeeds with no TypeScript errors (both dynamic-imported Canvas components are the most likely source of type friction — verify `ThreeElements` module augmentation from plan 03 compiles cleanly).
- [ ] Test the production build locally (`npm run build && npm run start`) before pushing to Vercel — dev mode can mask real hydration/SSR boundary issues that only appear in production builds, especially around the two `ssr: false` canvases.
- [ ] Confirm `robots`/`metadata` in `layout.tsx` are set to something reasonable (not the Next.js default placeholder) — small detail, but visible in the deployed `<title>` tab and any link previews reviewers generate.

## Final review pass against the brief's evaluation criteria

Before calling this done, walk through `Frontend_Task_docx.md`'s four evaluation categories one more time against the finished build:

- **UI/UX** — does the visual hierarchy read correctly at a glance, section to section? Compare side-by-side against the Figma file frames from `design_xai.md`.
- **Motion & Interaction** — is every animation purposeful (nothing added just to show off a library), and does timing/easing feel consistent across sections (the `power3.out`/`cubic-bezier(.16,1,.3,1)` curves from the original should feel like one coherent motion language, not three different libraries fighting each other)?
- **Engineering Quality** — re-read plan 00's component map; confirm no component ended up doing two jobs, and no logic got copy-pasted where a shared hook (plan 07) should have been used instead.
- **Product Thinking** — does scrolling through the page actually *explain* "raw data → structured intelligence → actionable insight → AI automation" without needing the brief to explain it to you first?
