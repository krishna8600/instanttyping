/**
 * src/scripts/xp-progress.ts
 * XP bar where ONE rAF driver moves the fill and the counted number together.
 * Vanilla TypeScript, zero dependencies.
 * Companion: src/styles/xp-progress.css (see markup contract there).
 *
 * Usage:
 *   import { animateXPProgress } from './xp-progress';
 *   animateXPProgress(
 *     document.querySelector('.xpwrap'),
 *     { pct: 20, xp: 340 },   // from
 *     { pct: 65, xp: 453 },   // to
 *   );
 */

export interface XPProgressOptions {
  /** ms for the fill. Default 900. */
  duration?: number;
  /** Called when the bar lands. */
  onDone?: () => void;
}

export function animateXPProgress(
  root: HTMLElement,
  from: { pct: number; xp: number },
  to: { pct: number; xp: number },
  opts: XPProgressOptions = {},
): void {
  const { duration = 900, onDone } = opts;
  const fill = root.querySelector<HTMLElement>('.xpbar-fill');
  const num = root.querySelector<HTMLElement>('.xpbar-num');
  const bar = root.querySelector<HTMLElement>('.xpbar');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clampPct = (p: number): number => Math.max(0, Math.min(100, p));
  const fmtXP = (x: number): string => Math.round(x).toLocaleString('en-US');

  function apply(pct: number, xp: number): void {
    if (fill) fill.style.width = `${clampPct(pct)}%`;
    if (num) num.textContent = fmtXP(xp);
    if (bar) {
      bar.setAttribute('aria-valuenow', String(Math.round(clampPct(pct))));
      bar.setAttribute('aria-valuetext', `${fmtXP(xp)} XP`);
    }
  }

  if (reduced || duration <= 0) {
    apply(to.pct, to.xp);
    onDone?.();
    return;
  }

  const start = performance.now();
  function frame(now: number): void {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    apply(from.pct + (to.pct - from.pct) * eased, from.xp + (to.xp - from.xp) * eased);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      apply(to.pct, to.xp);
      onDone?.();
    }
  }
  requestAnimationFrame(frame);
}
