# 02 — Layout Shell (Root Layout, Navbar, Footer, Cursor Glow)

## `src/app/layout.tsx`

Server component. Sets up `<html>`, fonts (from plan 01), metadata, and mounts the two always-on client widgets (`CursorGlow`, and later the GSAP `ScrollTrigger` registration happens lazily inside `lib/gsap.ts`, not here).

```tsx
export const metadata = {
  title: 'Xai – Intelligence Workspace',
  description: 'From raw data to structured intelligence, actionable insight, and AI automation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-fg font-body antialiased">
        <CursorGlow />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

`src/app/page.tsx` then just composes the five sections in order — it should read like a table of contents, no logic:

```tsx
export default function Home() {
  return (
    <>
      <HeroSection />
      <InsightFlowSection />
      <DashboardSection />
      <WowSection />
    </>
  );
}
```

## `components/layout/CursorGlow.tsx`

Original (`xai.html` lines 111–116, 542–543): a fixed 400×400 radial-gradient div whose `left`/`top` are set directly on every `mousemove`, with a CSS `transition` doing the easing.

**Port as-is, not as React state.** This is the textbook case for ref-based DOM mutation — if `left`/`top` were `useState`, every mouse pixel would re-render the tree.

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed z-[1] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-300 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(200,255,0,.04) 0%, transparent 70%)',
      }}
    />
  );
}
```

Wrap the `addEventListener` in the `useReducedMotion` check from plan 07 — if the user prefers reduced motion, skip mounting the listener entirely (the glow is decorative only).

## `components/layout/Navbar.tsx`

Maps to `xai.html` lines 128–147. Static markup (logo, 4 nav links, CTA button) — the only behavior is smooth-scroll-to-anchor, which the original does manually via `scrollIntoView` (lines 841–843) purely because it was overriding default anchor jump behavior; in Next.js this is unnecessary — `html { scroll-behavior: smooth }` (already in `globals.css` from plan 01) handles it for free with plain `<a href="#hero">` tags. **Do not** port the click-handler/`preventDefault` logic — it's dead weight once CSS smooth-scroll is in place.

Structure:
- Logo group: 28×28 accent square with "X", "Xai" label, "Intelligence Workspace" chip (hidden below `sm:`)
- Nav links: `Overview / How It Works / Dashboard / Experience` → `#hero #flow #dashboard #wow`
- CTA: `<Button variant="primary">Get Started</Button>` from plan 01

Container: `fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-bg/60 border-b border-bdr/60`, inner `max-w-7xl mx-auto px-6 h-14 flex items-center justify-between`.

## `components/layout/Footer.tsx`

Maps to `xai.html` lines 429–440. Fully static — logo mark, 4 text links, tagline. No client behavior needed; keep this a server component (no `'use client'`).

## Verification for this step

- Scrolling via nav links animates smoothly and lands under the fixed nav (if it doesn't, add `scroll-margin-top` to each section matching the navbar height, `56px`/`h-14` — the original didn't need this because it used `scrollIntoView` with default block alignment, but CSS-only smooth scroll needs the offset).
- Cursor glow follows the mouse with no jank and no React DevTools re-render highlighting on the rest of the tree while moving the mouse.
