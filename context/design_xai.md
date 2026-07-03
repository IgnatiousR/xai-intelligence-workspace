I can't create or upload an actual `.fig` file — I don't have access to Figma's API or any design tool. But I can give you a **complete, production-ready design spec** that makes rebuilding it in Figma straightforward and fast. Here it is:

---

# Xai — Intelligence Workspace: Figma Design Specification

## 1. File Setup

| Setting | Value |
|---|---|
| File name | `Xai - Intelligence Workspace` |
| Canvas color | `#06060A` |
| Frame preset | Desktop (1440 × 9000 or vertical long frame) |
| Grid | 8px columns, 24px gutter |

### Pages to Create

1. **Cover** — Project name, date, your name
2. **Design System** — Tokens, typography, colors, components
3. **Hero Section**
4. **Insight Flow**
5. **Dashboard Preview**
6. **WOW Moment**
7. **Responsive Notes** (optional)

---

## 2. Design Tokens

### Color Palette

Create a "Colors" page with these as local styles:

```
Background       #06060A
Background-Elevated  #0E0E14
Foreground       #EBEBEB
Foreground-Muted #6E6E7A
Accent           #C8FF00
Accent-Dim       #8AB300
Card             #111118
Border           #1C1C28

Semantic-Critical  #FF5F57
Semantic-Info      #5BA8FF
Semantic-Success   #28C840
```

### Typography

Create text styles for each:

| Style Name | Font | Weight | Size | Line Height | Letter Spacing | Color |
|---|---|---|---|---|---|---|
| `H1` | Space Grotesk | Bold | 80px | 92% | -3% | Foreground |
| `H1-Gradient` | Space Grotesk | Bold | 80px | 92% | -3% | Accent (use fill gradient) |
| `H2` | Space Grotesk | Bold | 48px | 110% | -2% | Foreground |
| `H3` | Space Grotesk | Bold | 30px | 120% | -1% | Foreground |
| `Section-Label` | Space Grotesk | Semibold | 12px | 100% | 20% | Accent |
| `Body-LG` | DM Sans | Regular | 20px | 160% | 0 | Foreground-Muted |
| `Body-MD` | DM Sans | Regular | 15px | 160% | 0 | Foreground-Muted |
| `Body-SM` | DM Sans | Regular | 13px | 150% | 0 | Foreground-Muted |
| `Caption` | DM Sans | Regular | 11px | 140% | 0 | Foreground-Muted |
| `Micro` | DM Sans | Regular | 10px | 140% | 20% uppercase | Foreground-Muted |
| `Metric-Value` | Space Grotesk | Bold | 18px | 120% | 0 | Foreground |
| `Metric-Label` | DM Sans | Regular | 11px | 140% | 0 | Foreground-Muted |
| `Metric-Delta` | DM Sans | Regular | 11px | 140% | 0 | Accent |

### Spacing Scale

```
4px   — xs
8px   — sm
12px  — md
16px  — lg
24px  — xl
32px  — 2xl
48px  — 3xl
64px  — 4xl
96px  — 5xl
128px — 6xl
```

### Border Radius

```
4px   — sm (tags, pills)
8px   — md (buttons, inputs)
12px  — lg (cards)
16px  — xl (panels, modals)
9999px — full (avatars, badges)
```

### Effects (Figma Effects Panel)

| Effect Name | Type | Settings |
|---|---|---|
| `Glow-Accent` | Drop Shadow | 0, 0, 40px, #C8FF0020 |
| `Glow-Accent-Soft` | Drop Shadow | 0, 0, 80px, #C8FF000A |
| `Card-Hover` | Drop Shadow | 0, 8px, 40px, #C8FF0010 |
| `Card-Base` | Drop Shadow | 0, 4px, 20px, #00000030 |

---

## 3. Components & Variants

### 3.1 Button → Component

**Properties:**
- `Variant`: Primary / Secondary / Ghost
- `State`: Default / Hover / Focus

| Variant | Fill | Stroke | Text | Padding | Radius |
|---|---|---|---|---|---|
| Primary-Default | Accent | None | Background | 10px 20px | 12px |
| Primary-Hover | Accent (brightness +10%) | None | Background | Same | Same |
| Secondary-Default | None | Border | Foreground | 10px 20px | 12px |
| Secondary-Hover | None | Foreground-Muted | Foreground | Same | Same |
| Ghost-Default | None | None | Foreground-Muted | 8px 16px | 8px |
| Ghost-Hover | Background-Elevated | None | Foreground | Same | Same |

**Auto Layout:** Horizontal, gap 8px, center-aligned

---

### 3.2 Sidebar Item → Component

**Properties:**
- `State`: Default / Active / Hover

| State | Fill | Text Color | Icon Color |
|---|---|---|---|
| Default | None | Foreground-Muted | Foreground-Muted |
| Hover | #C8FF0012 | Accent | Accent |
| Active | #C8FF0012 | Accent | Accent |

**Auto Layout:** Horizontal, gap 10px, padding 8px 12px, border-radius 8px

**Sub-layers:**
- Icon frame: 14×14, constraint: fit
- Label: text style `Body-SM`

---

### 3.3 Metric Card → Component

**Auto Layout:** Vertical, gap 4px, padding 14px, fill: Background-Elevated, radius: 12px, stroke: Border

**Sub-layers:**
1. Label — `Metric-Label` text style
2. Value — `Metric-Value` text style
3. Delta — `Metric-Delta` text style

**Variant:** `State`: Default / Hover
- Hover: stroke changes to `#C8FF0040`, slight Y translate (-1px)

---

### 3.4 Stage Card (Insight Flow) → Component

**Auto Layout:** Vertical, gap 0, padding 20px, fill: Card, radius: 16px, stroke: Border

**Variant:** `State`: Default / Hover
- Hover: stroke → `#C8FF0040`, add `Card-Hover` effect

**Sub-layer:**
- Canvas placeholder: aspect-ratio 16/9, fill: Background-Elevated, radius: 12px
  - Inside: add a note or a rough sketch of the visualization
  - Label it "Canvas Animation" in Caption style, centered, Foreground-Muted

---

### 3.5 Dashboard Tab → Component

**Properties:** `State`: Default / Active

| State | Text Color | Bottom Border |
|---|---|---|
| Default | Foreground-Muted | None |
| Active | Accent | 2px solid Accent, scaleX 1 |

**Auto Layout:** Horizontal, padding-bottom 12px (to leave room for border indicator)

The bottom border is a separate rectangle layer: width 100%, height 2px, fill Accent, positioned at bottom. In Default variant, set scaleX to 0. In Active, scaleX to 1.

---

### 3.6 Progress Bar → Component

**Properties:** `Variant`: Full / Dim70 / Dim50 / Dim30 (opacity levels)

**Structure:**
- Track: Horizontal, height 4px (or 6px), fill: Background, radius: 9999px
- Fill: Height 100%, fill: Accent (with variant opacity), radius: 9999px
  - Width set per instance (e.g., 42%, 28%, etc.)

---

### 3.7 Tag / Chip → Component

**Auto Layout:** Horizontal, padding 4px 10px, fill: Background-Elevated, stroke: Border, radius: 6px

**Text:** `Caption` style, Foreground-Muted

---

### 3.8 Insight Row → Component

**Auto Layout:** Horizontal, gap 8px, padding 6px, radius: 8px

**Variant:** `Hover`: Default / Hovered (fill: #FFFFFF06)

**Sub-layers:**
- Dot: 6×6 circle, fill varies (Critical: #FF5F57, Insight: Accent, Auto: #5BA8FF)
- Text block: Vertical, gap 2px
  - Title: `Caption`, Foreground
  - Subtitle: 10px, Foreground-Muted

---

### 3.9 Table Row → Component

**Auto Layout:** Horizontal, padding 10px, fill: none

**Variant:** `Hover`: Default (none) / Hovered (fill: #FFFFFF06)

**Sub-layers (5 columns):**
- Event text: `Caption`, Foreground
- Source text: `Caption`, Foreground-Muted (hidden on mobile — add a variant)
- Type badge: small pill with colored fill
- Status: dot + text
- Time: `Caption`, Foreground-Muted, right-aligned

---

### 3.10 Navigation Bar → Component

**Auto Layout:** Horizontal, height 56px, padding 0 24px, fill: #06060A99, backdrop blur, stroke-bottom: Border, width: 100%

**Sub-layers:**
- Logo group: Icon (28×28, fill Accent, radius 8px, "X" text) + "Xai" label + "Intelligence Workspace" chip
- Nav links group: Horizontal, gap 28px, `Body-SM`, Foreground-Muted
- CTA button: Primary button variant

---

## 4. Frame-by-Frame Layout

### Frame 1: Hero Section

**Frame:** 1440 × 900, fill: Background

**Layers (bottom to top):**

1. **Background gradient overlay** — Rectangle, fill: linear gradient (transparent → #06060A66 → #06060A), vertical
2. **Ambient glow** — Ellipse, 500×500, fill: #C8FF000A, blur: 100px, centered
3. **3D placeholder** — Rectangle, 100% × 100%, fill: none
   - Add a note: "Three.js particle field — chaos to grid morph on scroll"
   - Optionally place a low-opacity abstract dot grid sketch as a visual hint
4. **Badge** — Auto Layout horizontal, gap 8px, pill shape, stroke: Border, fill: #0E0E1466, backdrop blur
   - Dot: 6×6, fill: Accent, opacity 60%
   - Text: "Now processing 2.4M data points per second" — `Micro` style
   - Position: centered, Y = 35% from top
5. **Headline** — `H1` style, centered
   - Line 1: "From Raw Data"
   - Line 2: `H1-Gradient` style with gradient fill (Foreground → Accent, 135°)
   - Position: below badge, gap 24px
6. **Subheadline** — `Body-LG`, centered, max-width 640px
   - "Xai transforms unstructured data streams into structured intelligence, actionable insights, and autonomous AI workflows — in real time."
7. **CTA group** — Horizontal, gap 12px, centered
   - Primary button: "Start Building"
   - Secondary button: "Watch Demo"
8. **Scroll indicator** — Vertical group, centered, bottom: 32px
   - "SCROLL" — `Micro` style
   - Pill shape: 16×28, stroke: #6E6E7A40, with small dot inside (animated in code)

**Auto Layout for text group:** Vertical, align center, gap 24px, position: center of frame

---

### Frame 2: Insight Flow — Section Header

**Frame:** 1440 × 200, fill: Background

**Centered column, gap 14px:**
- "HOW IT WORKS" — `Section-Label`
- "Three stages of" — `H2`
- "intelligent transformation" — `H2` (same text frame, or separate line)

---

### Frame 3: Stage 1 — Ingest Data

**Frame:** 1440 × 480, fill: Background

**Layout:** 2-column grid, gap 56px, vertically centered

**Left column (text, right-aligned on desktop):**
- "01" — Space Grotesk Bold, 60px, Accent at 15% opacity
- "Ingest Data" — `H3`
- Body copy — `Body-MD`, max-width 420px
- Tag group — Horizontal wrap, gap 6px
  - Tag: "REST APIs"
  - Tag: "SQL / NoSQL"
  - Tag: "File Uploads"
  - Tag: "Webhooks"

**Right column:**
- Stage Card component instance
- Inside canvas area: sketch or note describing "Particle streams flowing to center collection point"

**Between stages (on a separate layer or frame):**
- Vertical line: 1px wide, centered, fill gradient (Accent 35% → Accent 6% → transparent), height ~112px

---

### Frame 4: Stage 2 — Analyze with AI

**Frame:** 1440 × 480, fill: Background

**Layout:** 2-column grid, gap 56px — **reversed order**

**Left column:** Stage Card (canvas note: "Neural network with signal propagation pulses")

**Right column (text):**
- "02" — same treatment
- "Analyze with AI" — `H3`
- Body copy
- Tags: "Pattern Detection", "Anomaly Scoring", "Correlation Maps"

---

### Frame 5: Stage 3 — Generate Insight

**Frame:** 1440 × 480, fill: Background

**Layout:** Same as Stage 1 (non-reversed)

**Left column (text):**
- "03"
- "Generate Insight"
- Body copy
- Tags: "NL Summaries", "Auto Actions", "Alert Triggers"

**Right column:** Stage Card (canvas note: "Insight cards appearing on grid with pulsing output icon")

---

### Frame 6: Dashboard — Section Header

**Frame:** 1440 × 180, fill: Background (with subtle vertical gradient overlay: transparent → #0E0E1428 → transparent)

Same pattern as Flow header:
- "PRODUCT PREVIEW" — `Section-Label`
- "Intelligence at your fingertips" — `H2`
- Subtitle — `Body-MD`

---

### Frame 7: Dashboard — Full UI

**Frame:** 1440 × 580, fill: Card, stroke: Border, radius: 16px, effect: Card-Base shadow

**Sub-layers:**

#### Title Bar
- Auto Layout: Horizontal, height 40px, padding 0 16px, stroke-bottom: Border
- Traffic lights: 3 circles (10×10), fills: #FF5F57, #FEBB2E, #28C840, gap 6px
- Center text: "app.xai.ai/workspace" — `Caption`
- Spacer + right padding for balance

#### Body: Horizontal split

**Sidebar (width: 208px, stroke-right: Border, fill: #0E0E1433):**

- Logo area (padding 14px, stroke-bottom: Border):
  - Logo icon + "Workspace" label
- Nav items (vertical, gap 2px, padding 10px 8px):
  - Sidebar Item: "Overview" — **Active** variant
  - Sidebar Item: "Data Sources"
  - Sidebar Item: "Analysis"
  - Sidebar Item: "Insights"
  - Sidebar Item: "Automations"
  - Sidebar Item: "Security"
- User area (padding 10px, stroke-top: Border):
  - Avatar circle (24×24, fill: #C8FF0018, "JD" text)
  - "Jane Doe" + "Admin" subtitle

**Main content (flex: 1, padding 16px, vertical, gap 16px):**

**Metric cards row:** 4-column grid, gap 10px
- Metric Card: "Data Points" → 2.4M → +12.4% from yesterday
- Metric Card: "AI Analyses" → 847 → +8.2% from yesterday
- Metric Card: "Insights Generated" → 156 → 23 critical
- Metric Card: "Automations Run" → 312 → 98.7% success rate

**Tab bar:** Horizontal, gap 20px, stroke-bottom: Border
- Tab: "Overview" — **Active**
- Tab: "Analytics"
- Tab: "Recent"

**Tab content — Overview (the visible one):**

5-column grid, gap 12px:

*Column 1-3 (span 3):* Chart card
- Header: "Processing Volume" + "Last 7 days" (right-aligned)
- Chart area: 16:9-ish rectangle, fill: none
  - Sketch a smooth bezier curve chart with 7 data points (Mon–Sun)
  - Area fill: Accent at 10% gradient
  - Line: 2px Accent
  - Dots: 5px circles with Background fill + Accent stroke
  - Y-axis labels: 3.0M, 2.25M, 1.5M, 0.75M, 0
  - X-axis labels: Mon–Sun
  - Grid lines: #1C1C28 at 50% opacity

*Column 4-5 (span 2):* Vertical, gap 12px

Card 1: "Data Sources"
- 4 progress bars:
  - PostgreSQL — 42% (Full variant)
  - REST API — 28% (Dim70 variant)
  - S3 Files — 18% (Dim50 variant)
  - Webhooks — 12% (Dim30 variant)

Card 2: "Latest Insights"
- 3 Insight Row instances:
  - Red dot / "Revenue anomaly detected" / "2 min ago — Critical"
  - Accent dot / "New correlation: churn vs support" / "18 min ago — Insight"
  - Blue dot / "Automation triggered: Slack alert" / "34 min ago — Auto"

**Tab content — Analytics (separate frame or hidden layer):**

2-column grid, gap 12px:
- Left: "Analysis Accuracy" chart (same style, 8 data points W1–W8, range 85–100%)
- Right: "Model Performance" — 3 progress bars (GPT-4: 96.2%, Claude: 94.8%, Custom v3: 91.4%)

**Tab content — Recent (separate frame or hidden layer):**

Table card:
- Header row: Event | Source | Type | Status | Time
- Row 1: "Anomaly batch #4821" | PostgreSQL | Critical pill | Green dot + Processed | 2m
- Row 2: "Correlation #1205" | REST API | Insight pill | Green dot + Processed | 18m
- Row 3: "Auto: Slack #alerts" | Webhook | Auto pill | Green dot + Sent | 34m
- Row 4: "Ingest: q4_data.csv" | S3 Files | Ingest pill | Accent dot + Running | 1h

---

### Frame 8: WOW Moment — Section Header

**Frame:** 1440 × 180, fill: Background

- "INTERACTIVE EXPERIENCE" — `Section-Label`
- "Watch intelligence emerge" — `H2`
- Subtitle: "Move your cursor to shape the data. Scroll to transform chaos into structure."

---

### Frame 9: WOW Moment — Canvas

**Frame:** 1440 × 560, fill: #11111866, stroke: Border, radius: 16px, backdrop blur

**Canvas area:** 100% × 100%

**Overlay UI (positioned absolutely at bottom):**

Bottom-left:
- "CURRENT STATE" — `Micro`
- "Raw Data" — `H3` (this changes with scroll: "Structured Grid" → "Intelligence Network")

Bottom-right:
- "Scroll to transform" — `Micro`
- Progress bar: 112×4px, track: Background-Elevated, fill: Accent (show at 0%, 33%, 66%, 100% as separate variants or notes)
- "0%" — `Caption`, Accent

**Center of canvas:** Add a large note: "Three.js 3D morphing point cloud — Sphere → Cube → Torus Knot, mouse-reactive, scroll-driven"

---

### Frame 10: Footer

**Frame:** 1440 × 80, fill: Background, stroke-top: Border

**Auto Layout:** Horizontal, space-between, padding 0 24px, vertically centered

- Left: Logo + "Xai Intelligence Workspace"
- Center: 4 links — "Documentation", "API Reference", "Status", "Privacy" — `Body-SM`, Foreground-Muted
- Right: "Built with intention. Delivered with craft." — `Caption`, Foreground-Muted

---

## 5. Component Page Layout

On the **Design System** page, organize as:

### Row 1: Color Swatches
- 8 rectangles (48×48, radius 8px) labeled below with hex values
- Group: "Color Palette"

### Row 2: Typography Scale
- Vertical list of every text style with its name and sample text
- Group: "Typography"

### Row 3: Spacing
- Small squares showing 4/8/12/16/24/32/48/64/96/128 with labels
- Group: "Spacing Scale"

### Row 4: Buttons
- All button variants in a horizontal row
- Group: "Buttons"

### Row 5: Cards & Components
- Metric Card (all states)
- Sidebar Item (all states)
- Tab (all states)
- Tag
- Insight Row
- Table Row
- Progress Bar (all variants)
- Group: "Components"

---

## 6. Key Figma Practices to Demonstrate

1. **Auto Layout everywhere** — Every group that contains multiple elements should use Auto Layout with explicit gaps, padding, and alignment
2. **Components with variants** — Every interactive element (buttons, sidebar items, tabs, cards) should be a component with `State` or `Variant` properties
3. **Consistent spacing** — Always use values from the spacing scale, never arbitrary pixel values
4. **Text styles** — All text should use the named text styles, never manually set font/size/color
5. **Color styles** — All fills and strokes should reference named color styles
6. **Nested components** — The Dashboard frame should compose Metric Card, Sidebar Item, Tab, Progress Bar, Insight Row, and Table Row components — never duplicate raw layers
7. **Constraints** — Set proper constraints on sidebar (left, right), main content (fill container), etc.
8. **Layer naming** — Use clear, consistent names: `Sidebar/Item/Active`, `Card/Metric/Hover`, `Tab/Default`

---

This spec covers every visual element, every component, every variant, every spacing value, and every layout relationship in the page. If you follow it top-to-bottom in Figma, the result will match the code implementation pixel-for-pixel.