/**
 * src/scripts/sparkline.ts
 * WPM-over-time sparkline for the results screen. Pure SVG, zero dependencies.
 * Companion: src/styles/sparkline.css
 *
 * Usage:
 *   import { renderSparkline } from './sparkline';
 *   // values: per-second (or per-sample) WPM numbers, chronological
 *   renderSparkline(document.getElementById('wpm-curve'), [42, 45, 47, ...], {
 *     label: 'WPM over the course of the test',
 *   });
 *
 * Data wiring (per-second WPM from the engine) happens in TypingEngine.astro;
 * this module only renders. The line draws itself in when scrolled into view.
 */

export interface SparklineOptions {
  /** px width. Default 260. */
  width?: number;
  /** px height. Default 64. */
  height?: number;
  /** Accessible description. */
  label?: string;
  /** Draw-in animation on first view. Default true. */
  animate?: boolean;
  /** Show end dot at the final value. Default true. */
  endDot?: boolean;
}

export function renderSparkline(el: HTMLElement, values: number[], opts: SparklineOptions = {}): void {
  const { width = 260, height = 64, label, animate = true, endDot = true } = opts;

  el.classList.add('spark');
  el.textContent = '';

  if (!values.length) {
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', label ?? 'No data yet');
    return;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 4;

  const x = (i: number): number =>
    values.length === 1 ? width / 2 : pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number): number =>
    pad + (1 - (v - min) / span) * (height - pad * 2);

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('aria-hidden', 'true');

  const linePts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  const area = document.createElementNS(NS, 'polygon');
  area.setAttribute('class', 'spark-area');
  area.setAttribute('points', `${pad},${height} ${linePts} ${width - pad},${height}`);

  const line = document.createElementNS(NS, 'polyline');
  line.setAttribute('class', 'spark-line');
  line.setAttribute('points', linePts);

  svg.append(area, line);

  let dot: SVGCircleElement | undefined;
  if (endDot) {
    dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('class', 'spark-dot');
    const lx = x(values.length - 1);
    const ly = y(values[values.length - 1]);
    dot.setAttribute('cx', String(lx));
    dot.setAttribute('cy', String(ly));
    dot.setAttribute('r', '3.5');
    svg.appendChild(dot);
  }

  el.appendChild(svg);

  const trend =
    values[values.length - 1] > values[0]
      ? 'trending up'
      : values[values.length - 1] < values[0]
        ? 'trending down'
        : 'steady';
  el.setAttribute('role', 'img');
  el.setAttribute(
    'aria-label',
    label ?? `WPM curve, ${trend}, from ${Math.round(values[0])} to ${Math.round(values[values.length - 1])} WPM`,
  );

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animate || reduced) return;

  // Draw-in when first visible.
  const start = (): void => {
    try {
      const len = (line as unknown as { getTotalLength(): number }).getTotalLength();
      el.style.setProperty('--spark-len', String(Math.ceil(len)));
    } catch {
      el.style.setProperty('--spark-len', '1000');
    }
    el.classList.add('spark-draw');
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
  } else {
    start();
  }
}
