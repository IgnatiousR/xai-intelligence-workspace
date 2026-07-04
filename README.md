# Xai — Intelligence Workspace

## Overview

A modern landing page for an AI-powered intelligence platform, demonstrating the journey from raw data through structured analysis to actionable insights and autonomous automation. Built as a component-based Next.js 16 application.

## Tech Stack

- **Framework**: Next.js 16 (App Router, `src/` directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D**: React Three Fiber + drei (two WebGL particle scenes)
- **Animation**: GSAP + ScrollTrigger (scroll-driven), Motion/Framer Motion (UI transitions)
- **Fonts**: Space Grotesk (display) + DM Sans (body) via `next/font/google`

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Composes all sections
│   └── globals.css         # Tailwind v4 @theme tokens + global styles
├── components/
│   ├── hero/               # R3F particle field scene
│   ├── insight-flow/       # 3-stage data pipeline with Canvas2D
│   ├── dashboard/          # Mock product UI with charts
│   ├── wow-moment/         # R3F morphing point cloud
│   ├── layout/             # Navbar, Footer, CursorGlow
│   └── ui/                 # Button, Tag, SectionHeader
├── hooks/                  # Shared React hooks
├── lib/                    # Utilities (cn, gsap registration)
├── shaders/                # GLSL shader definitions
└── data/                   # Typed mock data
```

## Animation & Interaction Decisions

The project uses three animation libraries, each chosen for its specific strength:

| Tool                     | Use Case                                                                 | Why                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Motion**               | Hero entrance stagger, tab crossfades, progress bars, layout animations  | Mount-triggered, declarative, React-idiomatic. `variants` + `staggerChildren` for sequenced reveals. `AnimatePresence` for tab content. `layoutId` for sliding underline.                     |
| **GSAP + ScrollTrigger** | Section header/block scroll reveals, WOW scroll-scrubbed morph           | Position-in-viewport triggered. ScrollTrigger's `start`/`end` viewport percentages match the original's exact thresholds. `scrub: true` provides smooth 0-1 progress tied to scroll position. |
| **R3F `useFrame`**       | Hero particle morph, WOW point cloud morph, all per-frame shader updates | Continuous, GPU-bound work. Position arrays mutated directly in typed arrays, never via React state. `dpr={[1,2]}` caps render resolution on high-DPI displays.                               |

**Key principle**: Per-frame values live in refs (read imperatively). Discrete state changes use React/Motion state. This prevents 60fps re-renders while keeping declarative UI clean.
