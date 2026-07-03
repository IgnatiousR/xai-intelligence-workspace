# 08 — Mock Data & Content

Centralizing copy/data that's reused across components or that a non-engineer might want to edit without touching JSX. Pulled verbatim from `xai.html` — no new content invented.

## `data/nav.ts`

```ts
export const navLinks = [
  { href: '#hero', label: 'Overview' },
  { href: '#flow', label: 'How It Works' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#wow', label: 'Experience' },
] as const;
```
(from `xai.html` lines 138–141)

## `data/stages.ts`

```ts
export type Stage = {
  index: string;
  title: string;
  body: string;
  tags: string[];
};

export const stages: Stage[] = [
  {
    index: '01',
    title: 'Ingest Data',
    body: 'Connect any data source — APIs, databases, file uploads, streaming events. Xai normalizes and structures incoming data in real time, regardless of format or volume.',
    tags: ['REST APIs', 'SQL / NoSQL', 'File Uploads', 'Webhooks'],
  },
  {
    index: '02',
    title: 'Analyze with AI',
    body: 'Multi-model AI pipelines process your data — detecting patterns, anomalies, and correlations that traditional analytics would miss. Every analysis is explainable and auditable.',
    tags: ['Pattern Detection', 'Anomaly Scoring', 'Correlation Maps'],
  },
  {
    index: '03',
    title: 'Generate Insight',
    body: 'Automated insight generation delivers actionable recommendations, natural language summaries, and trigger-based automations that turn analysis into action.',
    tags: ['NL Summaries', 'Auto Actions', 'Alert Triggers'],
  },
];
```
(from `xai.html` lines 196–241)

## `data/dashboard.ts`

```ts
export const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: 'grid' },     // lines 280-281
  { id: 'sources', label: 'Data Sources', icon: 'refresh' }, // lines 282-284
  { id: 'analysis', label: 'Analysis', icon: 'target' },    // lines 285-287
  { id: 'insights', label: 'Insights', icon: 'file' },      // lines 288-290
  { id: 'auto', label: 'Automations', icon: 'zap' },        // lines 291-293
  { id: 'security', label: 'Security', icon: 'shield' },    // lines 294-296
] as const;
// icon: map to the exact inline <svg> path data from xai.html lines 280-296
// — copy the path/rect/circle/polyline elements verbatim into a small
// components/dashboard/icons.tsx (one tiny functional component per icon,
// named by the `icon` key above), rather than pulling in an icon library.

export const metrics = [
  { label: 'Data Points', value: '2.4M', delta: '+12.4% from yesterday', tone: 'accent' },
  { label: 'AI Analyses', value: '847', delta: '+8.2% from yesterday', tone: 'accent' },
  { label: 'Insights Generated', value: '156', delta: '23 critical', tone: 'accent' },
  { label: 'Automations Run', value: '312', delta: '98.7% success rate', tone: 'muted' },
] as const;
// from xai.html lines 310-329

export const dataSources = [
  { label: 'PostgreSQL', value: 42, opacity: 1 },
  { label: 'REST API', value: 28, opacity: 0.7 },
  { label: 'S3 Files', value: 18, opacity: 0.5 },
  { label: 'Webhooks', value: 12, opacity: 0.3 },
] as const;
// from xai.html lines 353-356

export const latestInsights = [
  { tone: 'critical', title: 'Revenue anomaly detected', meta: '2 min ago — Critical' },
  { tone: 'insight', title: 'New correlation: churn vs support', meta: '18 min ago — Insight' },
  { tone: 'auto', title: 'Automation triggered: Slack alert', meta: '34 min ago — Auto' },
] as const;
// from xai.html lines 362-364

export const modelPerformance = [
  { label: 'GPT-4 Pipeline', value: 96.2, opacity: 1 },
  { label: 'Claude Pipeline', value: 94.8, opacity: 0.7 },
  { label: 'Custom Model v3', value: 91.4, opacity: 0.5 },
] as const;
// from xai.html lines 381-383

export const recentEvents = [
  { event: 'Anomaly batch #4821', source: 'PostgreSQL', type: 'Critical', status: 'Processed', statusTone: 'success', time: '2m' },
  { event: 'Correlation #1205', source: 'REST API', type: 'Insight', status: 'Processed', statusTone: 'success', time: '18m' },
  { event: 'Auto: Slack #alerts', source: 'Webhook', type: 'Auto', status: 'Sent', statusTone: 'success', time: '34m' },
  { event: 'Ingest: q4_data.csv', source: 'S3 Files', type: 'Ingest', status: 'Running', statusTone: 'accent', time: '1h' },
] as const;
// from xai.html lines 395-398

export const processingVolume = {
  data: [1.8, 2.1, 1.9, 2.4, 2.2, 2.6, 2.4],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  min: 0, max: 3,
}; // from xai.html line 855-856

export const analysisAccuracy = {
  data: [89, 91, 90, 93, 92, 95, 94, 96],
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
  min: 85, max: 100,
}; // from xai.html line 890-891
```

## `data/insightCards.ts` (co-located canvas mock data, optional split)

```ts
export const insightCards = [
  { text: 'Revenue dip detected in Q4', type: 'critical' },
  { text: 'Customer churn correlation: -0.87', type: 'insight' },
  { text: 'Automation triggered: Alert sent', type: 'auto' },
  { text: 'New pattern: support volume spike', type: 'insight' },
  { text: 'Anomaly score: 94.2%', type: 'critical' },
] as const;
// from xai.html lines 1010-1016 — used only by insight-flow/canvases/InsightCanvas.tsx
```

## Hero & footer copy (inline, not extracted)

Hero badge/headline/subtitle/CTA text and footer links are single-use, one-component-only strings — leave them as literal JSX in `HeroContent.tsx` and `Footer.tsx` respectively rather than over-abstracting into a data file nobody else reads from. Extract to a data file only when a string is reused across ≥2 components or needs non-engineer editing — none of these qualify.

## Verification for this step

- Every array above is fully typed (`as const` where the shape is a fixed literal union, e.g. `tone`/`type`/`statusTone` fields) so downstream components get autocomplete and type-checking on props like `tone: 'critical' | 'insight' | 'auto'` instead of loose `string`.
- No component in plans 03–06 contains a hardcoded copy of these arrays — grep the components directory for the literal strings above (e.g. `"2.4M"`, `"PostgreSQL"`) after implementation to confirm nothing drifted back into inline duplication.
