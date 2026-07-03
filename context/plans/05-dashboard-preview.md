# 05 — Dashboard Preview

Maps to `xai.html` lines 253–407 (markup) + chart drawing functions at 846–913 + tab/sidebar interaction logic at 817–838.

## Component breakdown

```
dashboard/
├── DashboardSection.tsx
├── DashboardWindow.tsx      # title bar + frame chrome, holds the flex(sidebar|main) layout
├── Sidebar.tsx
├── MetricCard.tsx
├── TabBar.tsx
├── tabs/
│   ├── OverviewTab.tsx
│   ├── AnalyticsTab.tsx
│   └── RecentTab.tsx
├── charts/
│   └── LineChart.tsx        # shared, data-driven — replaces drawMainChart + drawAccChart
├── ProgressBar.tsx
├── InsightRow.tsx
└── DataTable.tsx
```

## Why this section changes the most from the original

The original drives all interactivity — sidebar active item, tab switching, progress bar fills, chart (re)drawing — through `document.querySelectorAll` + manual `classList` toggling triggered by DOM `click` listeners (lines 817–838), plus a `ScrollTrigger.onEnter` callback that fires the *first* chart draw and progress bar fill only once the dashboard scrolls into view (lines 805–809). In React this all collapses into **local component state**, which is both less code and removes an entire class of bugs (e.g., the original's `tab-c.active{display:block}` + opacity dance becomes a straightforward conditional render).

## `DashboardSection.tsx`

```tsx
<section id="dashboard" className="relative px-6 py-28 sm:py-36">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bg-el/40 to-transparent" />
  <div className="relative mx-auto max-w-6xl">
    <SectionHeader
      label="Product Preview"
      title="Intelligence at your fingertips"
      subtitle="A workspace designed for clarity. Every metric, every insight, one unified view."
      className="mb-14"
    />
    <DashboardWindow />
  </div>
</section>
```

`DashboardWindow`'s mount-into-view entrance (`.dash-ctr`, lines 805–809) uses the same `useGsapScrollTrigger` pattern as plan 04 — `y: 35 → 0, opacity 0 → 1` at `top 82%`. The chart-draw-on-enter behavior the original needs (because it's imperative Canvas2D) becomes unnecessary in React: `LineChart` draws on its own mount via `useCanvasLoop` (from plan 04/07) regardless of when that happens to be, since canvas init is cheap and idempotent. No need to gate it behind scroll visibility.

## `DashboardWindow.tsx`

Static chrome (traffic-light dots, `app.xai.ai/workspace` label, lines 264–267) + flex layout housing `Sidebar` and the main content column. Height fixed at `500px` per original (line 269) — keep as an explicit `style={{ height: 500 }}` or `h-[500px]` since it's a deliberate design constraint (mock browser window), not a responsive value.

## `Sidebar.tsx`

Static list of 6 items (Overview/Data Sources/Analysis/Insights/Automations/Security, lines 279–296, each with an inline SVG icon — copy the `<svg>` markup verbatim, these are simple stroke icons, no need to swap to an icon library and risk visual drift) + a footer user block (Jane Doe / Admin, lines 298–303).

Active state — original toggles a CSS class on click (lines 833–838, purely cosmetic, doesn't change any content). Port as:

```tsx
const [active, setActive] = useState('overview');

{items.map((item) => (
  <button
    key={item.id}
    onClick={() => setActive(item.id)}
    className={cn(
      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors',
      active === item.id ? 'bg-accent/[.07] text-accent' : 'text-fg-m hover:bg-accent/[.07] hover:text-accent'
    )}
  >
    {item.icon}
    {item.label}
  </button>
))}
```

Item data (id/label/icon) lives in `data/dashboard.ts`.

## `MetricCard.tsx`

Props: `label`, `value`, `delta`, `deltaTone?: 'accent' | 'muted'`. 4 instances from lines 310–329 map to an array in `data/dashboard.ts`, rendered via `.map()`. Hover treatment (`.dc:hover`, lines 76–77 — border color shift + `translateY(-1px)`) as Tailwind: `transition-all duration-300 hover:border-accent/25 hover:-translate-y-px` (ease curve `cubic-bezier(.16,1,.3,1)` → Tailwind arbitrary `ease-[cubic-bezier(0.16,1,0.3,1)]` if you want the exact curve, default `ease-out` is a close-enough substitute).

## `TabBar.tsx` + tab content components

Original tab data-attribute + `dtab`/`.active` CSS class dance (lines 333–337, 818–830) becomes:

```tsx
// in DashboardWindow or a small DashboardTabs wrapper
const [tab, setTab] = useState<'overview' | 'analytics' | 'recent'>('overview');

<TabBar active={tab} onChange={setTab} />
<AnimatePresence mode="wait">
  {tab === 'overview' && <motion.div key="overview" {...fade}><OverviewTab /></motion.div>}
  {tab === 'analytics' && <motion.div key="analytics" {...fade}><AnalyticsTab /></motion.div>}
  {tab === 'recent' && <motion.div key="recent" {...fade}><RecentTab /></motion.div>}
</AnimatePresence>
```

where `fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.3 } }` — a direct, cleaner equivalent of the original's `.tab-c{opacity:0;transform:translateY(6px)} .tab-c.active{opacity:1;transform:translateY(0)}` (lines 78–79). Using Motion here (not GSAP) is correct per the animation-tool split in plan 07: this is a discrete state transition, not a scroll-scrubbed timeline.

`TabBar.tsx` renders the 3 tab buttons with the animated underline — port the `::after` scaleX approach (lines 71–74) as a `layoutId`-based Motion underline instead, which is the idiomatic React/Motion way to animate a shared indicator between buttons:

```tsx
{tabs.map((t) => (
  <button key={t.id} onClick={() => onChange(t.id)} className={cn('relative pb-3 text-[13px]', active === t.id ? 'text-accent' : 'text-fg-m hover:text-fg')}>
    {t.label}
    {active === t.id && (
      <motion.div layoutId="dtab-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
    )}
  </button>
))}
```

`layoutId` gives you the sliding-underline animation between tabs *for free* — arguably a nicer result than the original's independent scaleX-per-tab (which doesn't slide, it just fades each tab's own underline in/out).

## `charts/LineChart.tsx` — unifying `drawMainChart` + `drawAccChart`

These two functions (lines 846–913) are ~90% identical: grid lines, Y-axis labels, X-axis labels, bezier area+line, dot markers — differing only in `data`, `labels`, axis range/format, and canvas height. Collapse into one data-driven component:

```tsx
type LineChartProps = {
  data: number[];
  labels: string[];
  min: number;
  max: number;
  height: number;
  formatY: (v: number) => string; // e.g. v => `${v.toFixed(1)}M` or v => `${v.toFixed(0)}%`
};
```

Internally uses the `useCanvasLoop`-style pattern from plan 04, but since this chart is static (draws once, doesn't animate every frame), it can use a simpler one-shot `useEffect` + `ResizeObserver` redraw instead of a full `rAF` loop — no continuous animation needed here, unlike the stage canvases. Port the bezier-curve helper (`curve(pts)`, appears identically in both original functions) as an internal helper function, and the gradient/stroke/dot-marker drawing verbatim.

Usage:
```tsx
// OverviewTab.tsx
<LineChart data={[1.8,2.1,1.9,2.4,2.2,2.6,2.4]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} min={0} max={3} height={150} formatY={(v) => `${v.toFixed(1)}M`} />

// AnalyticsTab.tsx
<LineChart data={[89,91,90,93,92,95,94,96]} labels={['W1','W2','W3','W4','W5','W6','W7','W8']} min={85} max={100} height={130} formatY={(v) => `${v.toFixed(0)}%`} />
```

## `ProgressBar.tsx`

Props: `label`, `value` (0–100 or a percentage string like "96.2%"), `opacity?: 1 | 0.7 | 0.5 | 0.3` (matches the original's `bg-accent`/`bg-accent/70`/`/50`/`/30` variants, lines 353–356, 381–383). Animate width on mount/tab-enter via Motion (`initial={{ width: 0 }} animate={{ width: value + '%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}`) — direct swap for the original's `.pf{transition:width 1s cubic-bezier(...)}` + `style.width` set after a `setTimeout` (lines 80, 807, 827). Motion's `animate` prop on mount removes the need for the manual `setTimeout` delay hack the original used to let the initial `width:0` paint first.

## `InsightRow.tsx`

Props: `tone: 'critical' | 'insight' | 'auto'`, `title`, `meta`. Dot color from `tone` (red/accent/blue, lines 362–364). Hover: `hover:bg-bg/40 transition-colors`. Data (3 rows) in `data/dashboard.ts`.

## `DataTable.tsx`

The Recent tab's table (lines 393–400). Props: `rows: TableRow[]` where each row has `event, source, type, status, statusTone, time`. Column visibility breakpoints (`hidden sm:table-cell`, `hidden md:table-cell`) ported directly. Status pill color from `type` (critical/insight/auto/ingest → red/accent/blue/muted backgrounds, matching lines 395–398).

## Verification for this step

- Clicking sidebar items updates the active highlight without a full page re-render of unrelated sections (React DevTools profiler: only `Sidebar` re-renders).
- Switching tabs crossfades smoothly and the underline slides (not fades) between tab buttons.
- Both charts render correctly at their respective sizes and re-draw cleanly on window resize.
- Progress bars animate from 0 to their target width once, on first render of that tab (not re-triggering every time you switch back to an already-visited tab, unless you specifically want re-trigger — original re-fills analytics bars every click via `setTimeout` at line 827, decide deliberately whether to match that or improve on it by only animating once per mount).
