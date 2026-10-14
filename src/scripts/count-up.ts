/**
 * src/scripts/count-up.ts
 * Vanilla JS/TS count-up for headline KPI numbers (WPM, Accuracy, XP).
 * Uses IntersectionObserver + requestAnimationFrame.
 * Resolves instantly when prefers-reduced-motion is active.
 * Zero external libraries, zero copied code.
 */

export interface CountUpOptions {
  /** Duration in milliseconds (default: 800) */
  duration?: number;
  /** Decimal places (default: 0) */
  decimals?: number;
  /** Prefix string e.g. "+" */
  prefix?: string;
  /** Suffix string e.g. "%" or " XP" */
  suffix?: string;
  /** Optional callback fired when count-up completes */
  onDone?: () => void;
}

export function countUp(
  el: HTMLElement,
  target: number,
  options: CountUpOptions = {}
): void {
  const {
    duration = 800,
    decimals = 0,
    prefix = "",
    suffix = "",
    onDone,
  } = options;

  const isReduced = typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const format = (v: number): string => `${prefix}${v.toFixed(decimals)}${suffix}`;

  // Instant resolution under reduced motion or non-positive duration
  if (isReduced || duration <= 0 || isNaN(target)) {
    el.textContent = format(isNaN(target) ? 0 : target);
    onDone?.();
    return;
  }

  let hasAnimated = false;
  const startAnimation = () => {
    if (hasAnimated) return;
    hasAnimated = true;
    el.textContent = format(0);
    const startTs = performance.now();

    function step(now: number) {
      const elapsed = now - startTs;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic: fast initial burst, decelerates softly to target
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = format(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = format(target);
        onDone?.();
      }
    }

    requestAnimationFrame(step);
  };

  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            startAnimation();
            break;
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    // Safeguard fallback: if observer doesn't trigger within 250ms, animate anyway
    setTimeout(() => {
      if (!hasAnimated) {
        try { observer.disconnect(); } catch {}
        startAnimation();
      }
    }, 250);
  } else {
    startAnimation();
  }
}
