# 01 — Project Setup & Design System

## Step 1: Scaffold

```bash
npx create-next-app@latest xai-intelligence-workspace \
  --typescript --tailwind --app --src-dir --eslint --import-alias "@/*"

cd xai-intelligence-workspace
```

Confirm you land on Next.js 16 / React 19 / Tailwind v4 (the CLI installs v4 by default now — `package.json` should show `"tailwindcss": "^4"`, and there should be **no** `tailwind.config.ts` colors block, just `src/app/globals.css` with `@import "tailwindcss";`).

## Step 2: Install the rest of the stack

```bash
# 3D
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three

# Animation
npm install gsap @gsap/react
npm install motion

# Small utilities
npm install clsx tailwind-merge
```

`@gsap/react` gives us `useGSAP()`, the official React hook wrapper around `gsap.context()` — this is what makes GSAP safe under React 18/19 Strict Mode double-invocation instead of hand-rolling cleanup.

`motion` is the current package name for Framer Motion (`import { motion } from "motion/react"`).

## Step 3: `tsconfig.json` paths

Confirm `@/*` → `src/*` is present (the CLI sets this automatically with `--import-alias`):

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Step 4: Fonts

Original uses Google Fonts `Space Grotesk` (display) + `DM Sans` (body) via a `<link>` tag. Replace with `next/font/google` in `src/app/layout.tsx` — this self-hosts and eliminates the render-blocking external request:

```tsx
// src/app/layout.tsx
import { Space_Grotesk, DM_Sans } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
});
```

Apply `${spaceGrotesk.variable} ${dmSans.variable}` on `<html>` or `<body>`, then reference `var(--font-display)` / `var(--font-body)` from Tailwind's `@theme`.

## Step 5: Tailwind v4 tokens (`src/app/globals.css`)

Tailwind v4 config is CSS-native. Everything that was in `tailwind.config = { theme: { extend: { colors, fontFamily } } }` in the HTML `<script>` block moves into an `@theme` block. Values sourced directly from `xai.html` lines 26–39 and the Figma spec's color table:

```css
@import "tailwindcss";

@theme {
  /* Colors — from xai.html :root and Tailwind config */
  --color-bg: #06060a;
  --color-bg-el: #0e0e14;
  --color-fg: #ebebeb;
  --color-fg-m: #6e6e7a;
  --color-accent: #c8ff00;
  --color-accent-d: #8ab300;
  --color-card: #111118;
  --color-bdr: #1c1c28;

  /* Semantic (from design_xai.md, used in dashboard status pills/dots) */
  --color-critical: #ff5f57;
  --color-info: #5ba8ff;
  --color-success: #28c840;

  /* Fonts */
  --font-display: var(--font-display), 'Space Grotesk', sans-serif;
  --font-body: var(--font-body), 'DM Sans', sans-serif;
}

/* ---- Global element styles ported from xai.html <style> ---- */

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: var(--color-bdr); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-fg-m); }

/* Gradient headline text — xai.html .grad-text */
.text-gradient-accent {
  background: linear-gradient(135deg, var(--color-fg) 30%, var(--color-accent) 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* CTA glow — xai.html .accent-glow */
.shadow-accent-glow {
  box-shadow: 0 0 40px rgba(200, 255, 0, .12), 0 0 80px rgba(200, 255, 0, .04);
}

/* Animated conic-gradient border on hover — xai.html .bgrad */
.border-gradient-hover {
  position: relative;
  overflow: hidden;
}
.border-gradient-hover::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(from 180deg, transparent, var(--color-accent), transparent 40%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity .5s ease;
  animation: spin-border 4s linear infinite;
}
.border-gradient-hover:hover::before { opacity: 1; }
@keyframes spin-border { to { transform: rotate(360deg); } }

/* Noise overlay — xai.html body::after */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: .4;
}

@keyframes pulse-soft { 0%, 100% { opacity: .35; } 50% { opacity: .85; } }
.animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }

@keyframes float-dot { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.animate-float-dot { animation: float-dot 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

Note: this file intentionally keeps the small set of effects that are genuinely global/reusable (noise, scrollbar, gradient text, glow, reduced-motion kill-switch). Everything else — hover states on cards, tabs, sidebar items — moves into Tailwind utility classes directly on the components in later plan files, since those are one-component-only and don't need a global class.

## Step 6: Spacing/radius — no extra config needed

`xai.html`'s spacing scale (4/8/12/16/24/32/48/64/96/128) and radius scale (4/8/12/16/full) from `design_xai.md` already match Tailwind's default scale almost exactly (`1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px, `24`=96px, `32`=128px). **Do not** add a custom spacing scale — use Tailwind defaults so the design system stays standard and portable.

## Step 7: Base UI primitives

These three replace repeated inline Tailwind strings scattered across the original HTML (buttons appear twice, tags appear 10x, the "label + H2 + subtitle" header pattern appears 3x).

### `src/components/ui/Button.tsx`

Props: `variant: 'primary' | 'secondary'`, standard button props. Maps to `xai.html` lines 143 and 167–168:

- `primary`: `bg-accent text-bg font-display font-semibold rounded-xl hover:brightness-110 shadow-accent-glow`
- `secondary`: `border border-bdr text-fg font-display font-medium rounded-xl hover:border-fg-m`

Both get `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50` (original uses `focus:` — switch to `focus-visible:` so mouse clicks don't show the ring, keyboard nav still does).

### `src/components/ui/Tag.tsx`

Single prop `children`. Maps to the repeated `<span class="px-2.5 py-1 rounded-md bg-bg-el border border-bdr text-[11px] text-fg-m font-body">` pattern (lines 199–202, 222–224, 238–240).

### `src/components/ui/SectionHeader.tsx`

Props: `label: string`, `title: React.ReactNode`, `subtitle?: string`. Maps to the repeated pattern at lines 182–185, 256–259, 413–416 (`text-accent ... uppercase` label, `H2`-style title, muted subtitle). This component's entrance animation (fade+rise on scroll) is handled by the `useGsapScrollTrigger` hook from plan 07 — passed a `className` for the trigger target, not baked in, so it stays a dumb presentational component.

## Verification for this step

- `npm run dev` shows a blank page with the correct background color (`#06060a`) and no console errors.
- Inspect an element and confirm `font-family` resolves to Space Grotesk/DM Sans (not the browser default) — confirms `next/font` wiring is correct before building anything visual on top of it.
