// src/scripts/dock.ts
// Vanilla macOS-style magnification dock. Zero dependencies.
// Monochrome, frosted, respects prefers-reduced-motion.
//
// Intended placement: results-screen action dock (Try again, Next test,
// Train mistakes, Certificate, Download PNG, Copy results).
//
// Usage:
//   import { createDock } from './dock';
//   const destroy = createDock(document.getElementById('results-dock')!, [
//     { icon: 'restart',  label: 'Try again',        onClick: () => restartTest() },
//     { icon: 'next',     label: 'Next test',        onClick: () => nextTest() },
//     { icon: 'target',   label: 'Train mistakes',   onClick: () => startDrill() },
//     { icon: 'award',    label: 'Certificate',      onClick: () => showCertificate() },
//     { icon: 'download', label: 'Download PNG',     onClick: () => downloadCard() },
//     { icon: 'copy',     label: 'Copy results',     onClick: () => copyResults() },
//   ]);
//   // destroy() removes listeners when the dock is torn down.

export type DockIconName = 'restart' | 'next' | 'target' | 'award' | 'download' | 'copy';

export interface DockItem {
  icon?: DockIconName;
  label: string;
  onClick?: () => void;
  element?: HTMLElement;
  id?: string;
}

const ICON_SVGS: Record<DockIconName, string> = {
  restart:
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  next:
    '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>',
  target:
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  award:
    '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  copy:
    '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
};

const CSS = `
.it-dock {
  display: inline-flex; align-items: flex-end; gap: 6px;
  padding: 10px 12px; border-radius: 22px;
  background: rgba(255,255,255,.6); color: #1d1d1f;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 16px 40px rgba(0,0,0,.12);
  -webkit-backdrop-filter: blur(16px) saturate(1.4); backdrop-filter: blur(16px) saturate(1.4);
}
.dark .it-dock, [data-theme="dark"] .it-dock {
  background: rgba(28,28,30,.6); color: #f5f5f7; border-color: rgba(255,255,255,.1);
  box-shadow: 0 16px 40px rgba(0,0,0,.5);
}
.it-dock-icon {
  position: relative; width: 46px; height: 46px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  background: rgba(0,0,0,.05); border: 1px solid transparent;
  transition: background .15s ease, border-color .15s ease;
  transform-origin: bottom center; will-change: transform;
}
.dark .it-dock-icon, [data-theme="dark"] .it-dock-icon { background: rgba(255,255,255,.07); }
.it-dock-icon:hover { border-color: rgba(0,114,245,.4); }
.it-dock-icon:focus-visible { outline: 2px solid #0072f5; outline-offset: 2px; }
.it-dock-icon svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.it-dock-icon.cpb-button {
  width: 46px; height: 46px; padding: 0; border-radius: 14px;
  justify-content: center;
}
.it-dock-icon.cpb-button .cpb-label { display: none; }
.it-dock-icon.cpb-button .cpb-icon { width: 22px; height: 22px; }
.it-dock-icon.cpb-button .cpb-icon svg { width: 22px; height: 22px; }
.it-dock-icon::after {
  content: attr(data-label);
  position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%) translateY(4px);
  white-space: nowrap; font-size: 12px; font-weight: 600;
  padding: 6px 10px; border-radius: 999px;
  background: #1d1d1f; color: #f5f5f7;
  opacity: 0; pointer-events: none; transition: opacity .15s ease, transform .15s ease;
}
.dark .it-dock-icon::after, [data-theme="dark"] .it-dock-icon::after { background: #f5f5f7; color: #1d1d1f; }
.it-dock-icon:hover::after, .it-dock-icon:focus-visible::after { opacity: 1; transform: translateX(-50%) translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .it-dock-icon { transition: none; }
}
`;

const RANGE = 110; // px — magnification falloff distance from cursor
const MAX_SCALE = 1.6;

let styleInjected = false;
function ensureStyles(): void {
  if (styleInjected) return;
  const el = document.createElement('style');
  el.setAttribute('data-it-dock', '');
  el.textContent = CSS;
  document.head.appendChild(el);
  styleInjected = true;
}

/**
 * Build a magnification dock inside `container`. Returns a cleanup function.
 * On touch devices / reduced-motion, renders as a static tappable icon row.
 */
export function createDock(container: HTMLElement, items: DockItem[]): () => void {
  ensureStyles();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bar = document.createElement('div');
  bar.className = 'it-dock';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Result actions');

  const iconEls: HTMLElement[] = items.map((item) => {
    let b: HTMLElement;
    if (item.element) {
      b = item.element;
      b.classList.add('it-dock-icon');
      b.dataset.label = item.label;
      if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', item.label);
      if (!b.getAttribute('title')) b.setAttribute('title', item.label);
      if (item.id) b.id = item.id;
      if (item.onClick) b.addEventListener('click', item.onClick);
    } else {
      b = document.createElement('button');
      (b as HTMLButtonElement).type = 'button';
      b.className = 'it-dock-icon';
      b.dataset.label = item.label;
      b.setAttribute('aria-label', item.label);
      b.setAttribute('title', item.label);
      if (item.id) b.id = item.id;
      b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON_SVGS[item.icon || 'restart']}</svg>`;
      if (item.onClick) b.addEventListener('click', item.onClick);
    }
    bar.appendChild(b);
    return b;
  });

  container.appendChild(bar);

  if (reduceMotion) {
    return () => bar.remove();
  }

  let raf = 0;
  let lastX = -1;

  const apply = () => {
    raf = 0;
    for (const el of iconEls) {
      if (lastX < 0) {
        el.style.transform = '';
        continue;
      }
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const d = Math.abs(lastX - cx);
      const t = Math.max(0, 1 - d / RANGE);
      // Cosine falloff: 1 at cursor, easing to 0 at RANGE — the macOS curve.
      const s = 1 + (MAX_SCALE - 1) * Math.cos((1 - t) * Math.PI / 2);
      el.style.transform = s > 1.01 ? `scale(${s.toFixed(3)}) translateY(${(-(s - 1) * 14).toFixed(1)}px)` : '';
    }
  };

  const onMove = (e: MouseEvent) => {
    lastX = e.clientX;
    if (!raf) raf = requestAnimationFrame(apply);
  };
  const onLeave = () => {
    lastX = -1;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  bar.addEventListener('mousemove', onMove);
  bar.addEventListener('mouseleave', onLeave);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    bar.removeEventListener('mousemove', onMove);
    bar.removeEventListener('mouseleave', onLeave);
    bar.remove();
  };
}
