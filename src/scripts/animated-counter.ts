/**
 * src/scripts/animated-counter.ts
 * Odometer counter: digits roll from 0 to the target on the results screen.
 * Vanilla TypeScript, zero dependencies. Transform-only animation.
 * Companion: src/styles/animated-counter.css
 *
 * Usage:
 *   import { animateCounter } from './animated-counter';
 *   animateCounter(document.getElementById('wpm-num'), 48);
 *   animateCounter(document.getElementById('acc-num'), 96.5, { decimals: 1, duration: 1300 });
 *
 * Markup: any empty inline element, e.g. <span id="wpm-num" class="acounter"></span>
 * The script builds the digit wheels, a visually-hidden true value, and
 * drives one rAF loop. Reduced-motion users jump straight to the value.
 */

export interface CounterOptions {
  /** ms for the roll-up. Default 1100. */
  duration?: number;
  /** Decimal places. Default 0. */
  decimals?: number;
  /** Called once the counter lands. */
  onDone?: () => void;
}

const isDigit = (ch: string): boolean => ch >= '0' && ch <= '9';

export function animateCounter(el: HTMLElement, target: number, opts: CounterOptions = {}): void {
  const { duration = 1100, decimals = 0, onDone } = opts;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (v: number): string => v.toFixed(decimals);

  let wheels: (HTMLElement | null)[] = [];
  let builtFor = '';

  const sameLayout = (a: string, b: string): boolean =>
    a.length === b.length && [...a].every((ch, i) => isDigit(ch) === isDigit(b[i]));

  function build(s: string): void {
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'ac-sr';
    sr.textContent = s;
    el.appendChild(sr);
    wheels = [];
    for (const ch of s) {
      if (isDigit(ch)) {
        const col = document.createElement('span');
        col.className = 'ac-col';
        col.setAttribute('aria-hidden', 'true');
        const strip = document.createElement('span');
        strip.className = 'ac-strip';
        for (let d = 0; d <= 9; d++) {
          const g = document.createElement('span');
          g.textContent = String(d);
          strip.appendChild(g);
        }
        col.appendChild(strip);
        el.appendChild(col);
        wheels.push(strip);
      } else {
        const st = document.createElement('span');
        st.className = 'ac-static';
        st.setAttribute('aria-hidden', 'true');
        st.textContent = ch;
        el.appendChild(st);
        wheels.push(null);
      }
    }
    builtFor = s;
  }

  function paint(v: number): void {
    const s = fmt(v);
    if (!sameLayout(s, builtFor)) build(s);
    const sr = el.querySelector('.ac-sr');
    if (sr) sr.textContent = s;
    for (let i = 0; i < s.length; i++) {
      const w = wheels[i];
      if (!w) continue;
      const d = s.charCodeAt(i) - 48;
      w.style.transform = `translateY(${-d}em)`;
    }
  }

  if (reduced || duration <= 0) {
    paint(target);
    onDone?.();
    return;
  }

  build(fmt(0));
  paint(0);
  const start = performance.now();

  function frame(now: number): void {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart: fast start, soft landing
    paint(target * eased);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      paint(target);
      onDone?.();
    }
  }
  requestAnimationFrame(frame);
}
