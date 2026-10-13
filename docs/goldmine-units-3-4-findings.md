# Goldmine Units 3–4: Telemetry & Sparkline Duplication Investigation

**Date:** 2026-10-13  
**Status:** Read-only Investigation & Architectural Recommendation  
**Spec Reference:** `docs/goldmine-plan.md` (Units 3 & 4)

---

## Executive Summary

1. **`secondBySecondWpm` contains cumulative average WPM, NOT instantaneous WPM.**  
   Each second boundary samples `calculateMetrics(correctKeystrokes, incorrectKeystrokes, elapsedSeconds).netWpm`, which evaluates overall speed from time $0$ to $t$. This heavily dampens real burst typing and mid-test pauses.
2. **`renderSparkline()` and `sparkline.css` are completely unused.**  
   They exist as unreferenced, orphaned files in `src/scripts/` and `src/styles/`.
3. **The planned Unit 4 sparkline directly duplicates the existing Results Screen chart.**  
   The results screen already contains a prominent, 500×100 SVG timeline chart (`#timeline-chart-svg`) complete with cubic Bezier curves, area gradients, 20-WPM gridlines, time steps, average lines, peak speed callouts, crosshairs, and dynamic tooltips. Adding a separate 220×48 unlabelled sparkline creates visual redundancy and user confusion.
4. **Recommendation: Merge Units 3 & 4.**  
   Combine per-second telemetry capture and progression visualization into a single cohesive unit: "Per-Second Telemetry & Progression Chart Enhancement". Feed authentic per-second telemetry into the existing `#timeline-chart-svg` (optionally plotting both instantaneous speed and the smoothed trendline), and retire/archive the orphaned `sparkline.ts`/`.css`.
5. **Exact Type Names for Unit 3:**  
   The test results payload consumed by the results screen is `CompletedTestSummary` (defined in `src/components/TypingEngine.astro`), which extends `MetricSummary` (defined in `src/utils/metrics.ts`). In addition, persisted profile history uses `TestHistoryEntry` (in `src/utils/metrics.ts`).

---

## Detailed Findings

### 1. `renderTimelineChart()` and `secondBySecondWpm` Contents

#### What `secondBySecondWpm` actually holds
In `src/components/TypingEngine.astro` (lines 1912–1920 & 1991–2001):
```typescript
const currentSecInt = Math.floor(elapsedSeconds);
if (currentSecInt > lastSecondRecorded) {
  const interimMetrics = calculateMetrics(
    correctKeystrokes,
    incorrectKeystrokes,
    elapsedSeconds,
  );
  secondBySecondWpm.push(interimMetrics.netWpm);
  lastSecondRecorded = currentSecInt;
}
```
In `calculateMetrics()` (`src/utils/metrics.ts`):
```typescript
const timeMinutes = Math.max(elapsedSeconds / 60, 0.001);
const netWpm = Math.max(0, Math.round((correctChars / 5) / timeMinutes));
```
- **Cumulative Running Average:** Because `correctKeystrokes` is the total count of correct characters typed since the test began, `interimMetrics.netWpm` is the **cumulative average Net WPM up to elapsed second $t$**, not the typing rate during second $[t-1, t]$.
- **Impact:** 
  - Rapid bursts (e.g., 120 WPM for 2 seconds) produce tiny blips in a 60-second test.
  - A hesitation or stumble at second 30 is largely masked by the preceding 29 seconds.
  - The consistency metric calculation (`cv = stdDev / mean`) inside `calculateMetrics()` is currently computing the variance of running cumulative averages, severely understating pacing volatility.

#### What `renderTimelineChart()` does
Located at lines 2525–2659 in `src/components/TypingEngine.astro`, it renders inside:
`<svg id="timeline-chart-svg" viewBox="0 0 500 100">` within the **Speed Progression Card** (lines 768–794).
Key features already built:
- **Smooth Bezier Spline:** Uses cubic control points (`tension = 0.2`) to draw a fluid line.
- **Area Fill:** Gradient under the curve (`#0072F5` fade).
- **Scale & Y-Axis:** Auto-rounds max WPM to multiples of 20 (min 40); draws horizontal dashed gridlines at 20-WPM increments with tabular numbers.
- **X-Axis Time Markers:** Dynamically computes time steps (1s, 2s, 5s, 10s, 15s, 30s) based on test duration.
- **Reference Lines & Callouts:**
  - Dashed horizontal line indicating overall test **Average WPM**.
  - Highlighted **Peak WPM** coordinate with dynamic anchor alignment (start/middle/end) and dot marker.
  - Glowing halo dot on the final second point.
- **Interactive Tooltip & Crosshairs (lines 3823–3880):** Full pointer tracking on hover/touch displaying:
  `"[WPM] WPM · [sec]s · [+/-] vs avg"` with clamped card-edge positioning.

---

### 2. Status of `sparkline.ts` and `sparkline.css`

#### What `renderSparkline()` does (`src/scripts/sparkline.ts`)
- Takes an HTML element, an array of numbers, and options (`width = 260`, `height = 64`, `animate = true`, `endDot = true`).
- Computes `min`/`max` bounding box with 4px padding.
- Emits pure SVG with a `<polygon class="spark-area">` and `<polyline class="spark-line">` connecting straight line segments.
- Generates an accessible `aria-label` describing the direction: `"WPM curve, trending up, from 45 to 78 WPM"`.
- Uses an `IntersectionObserver` to trigger a CSS `stroke-dashoffset` draw-in animation (`spark-draw`, 1.1s cubic-bezier) defined in `src/styles/sparkline.css`.
- Skips animations if `prefers-reduced-motion: reduce` is active.
- Does **not** include axes, gridlines, numeric labels, tooltips, or peak indicators.

#### Current Usage
- **Grep check:** Zero imports of `renderSparkline` across the codebase.
- **CSS check:** Zero imports of `sparkline.css` (neither in `global.css` nor in any `.astro` component).
- **Conclusion:** Both files are completely orphaned draft assets.

---

### 3. Duplication Analysis & Proposed Merged Shape

#### Does planned Unit 4 duplicate the existing timeline chart?
**Yes, entirely.**
Both components display the exact same time-series dimension: test duration (seconds) vs. WPM.

Displaying both on the results screen creates serious design friction:
1. **Redundancy:** The results screen would display two graphs of the same run: a 220px sparkline inside the Net Speed card and a 500px interactive chart right below it.
2. **Visual Inconsistency:** If one chart plots cumulative average while the other plots instantaneous cadence, users will perceive them as conflicting data. If both plot the same data, one is redundant clutter.
3. **Card Real Estate:** Squeezing a 220×48 SVG into the top KPI metric card crowds the primary large numeric display (`#res-net-wpm`, rank badge, accuracy, consistency).

#### Proposed Merged Shape: Merge Units 3 & 4 into One Unit

**Merged Unit Name:** **Goldmine Unit 3: Per-Second Telemetry & Progression Chart Enhancement**

| Approach | Verdict | Rationale |
|---|---|---|
| **Option A:** Add separate micro-sparkline into KPI card + keep existing chart | ❌ **Reject** | Clutters KPI card; duplicates the timeline; forces maintenance of two SVG chart renderers. |
| **Option B:** Replace existing timeline chart with `renderSparkline()` | ❌ **Reject** | Huge functional downgrade (removes gridlines, peak markers, time steps, crosshairs, and hover tooltips). |
| **Option C (Recommended):** Extend existing `#timeline-chart-svg` with true per-second telemetry, and retire `sparkline.ts` |  **Recommended** | Enhances the existing, proven chart with true instantaneous burst/dip fidelity; keeps results UI clean and Apple-grade; eliminates dead code. |

#### Specific Enhancements in the Merged Shape
1. **Per-Second Sampling:**
   - Sample instantaneous keystrokes: `instantNetWpm = Math.max(0, Math.round(((currCorrect - prevCorrect) / 5) * 60))`.
   - Sample instantaneous errors: `instantErrors = currErrors - prevErrors`.
   - Retain cumulative running average: `cumulativeNetWpm = Math.max(0, Math.round((currCorrect / 5) / (t / 60)))`.
2. **Timeline Chart Visual Upgrade:**
   - Plot the **instantaneous curve** (or subtle area curve) showing authentic pacing peaks, pauses, and surges.
   - Overlay the **cumulative trendline** (or smoothed rolling average) so the typist sees both their rhythm variability and their overall pace.
   - Update tooltip to show: `Instant: X WPM · Avg: Y WPM · t=Zs`.
3. **Cleanup:**
   - Delete or archive `src/scripts/sparkline.ts` and `src/styles/sparkline.css` to keep the codebase lean and free of unreferenced dead weight.

---

### 4. Exact Target Types for Unit 3

There are three related types in the codebase that handle metrics and test summaries. Here is the verified breakdown:

```
┌────────────────────────────────────────────────────────────────────────┐
│ MetricSummary (src/utils/metrics.ts)                                   │
│ Pure mathematical output of calculateMetrics()                         │
│ { netWpm, rawWpm, accuracy, totalKeystrokes, correctChars, ... }       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ extends
┌───────────────────────────────────▼────────────────────────────────────┐
│ CompletedTestSummary (src/components/TypingEngine.astro)               │
│ Primary rich runtime payload generated at finishTest()                │
│ Consumed by showResults(), renderTimelineChart(), window.__lastTest...  │
│ { ...MetricSummary, missedWords, keyMistakes, keystrokeLog }           │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ TestHistoryEntry (src/utils/metrics.ts)                                │
│ Persisted profile history record in localStorage ('ptt_test_history_v1')│
│ { id, timestamp, mode, durationSeconds, netWpm, rawWpm, accuracy... }  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Exact Targeting Recommendations for Unit 3:
1. **Primary Runtime Results Type:**
   Target **`CompletedTestSummary`** in `src/components/TypingEngine.astro` (which extends `MetricSummary`).
   Add:
   ```typescript
   secondBySecondWpm: number[];      // Instantaneous per-second Net WPM
   cumulativeWpmHistory?: number[];  // Cumulative running average WPM
   secondBySecondErrors?: number[];  // Errors registered in each second
   ```
2. **Metrics Computation Type:**
   If `calculateMetrics()` in `src/utils/metrics.ts` needs to return or receive these arrays, add `wpmHistory?: number[]` to `MetricSummary`. Note that `calculateMetrics` already accepts `wpmHistory: number[] = []` on line 39 for calculating consistency (`variance` / `stdDev`).
3. **Persistence Type:**
   In `src/utils/metrics.ts`, add optional `wpmHistory?: number[]` to **`TestHistoryEntry`** so tests saved to `localStorage` preserve pacing curves (capped at ~180 entries to prevent storage bloat).

---

## Next Steps

1. **User Decision on Plan Reshaping:**
   - Confirm merging Units 3 and 4 into a single unit in `docs/goldmine-plan.md`.
   - Confirm retiring the unused `src/scripts/sparkline.ts` and `src/styles/sparkline.css`.
2. **Proceed to Implementation:**
   - Update `docs/goldmine-plan.md` to reflect the merged unit scope before touching production code.
