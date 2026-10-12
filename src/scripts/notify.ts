// src/scripts/notify.ts
// Lightweight frosted notification toasts. Zero dependencies, vanilla TS.
// One consistent system for: achievement unlocks, copy feedback, level-ups,
// streak-freeze saves, drill completions.
//
// Usage:
//   import { notify } from './notify';
//   notify({ title: 'Achievement unlocked', description: 'Week Warrior — 7-day streak', icon: 'trophy' });
//   const dismiss = notify({ title: 'Copied!', icon: 'copy', duration: 2500 });
//   dismiss(); // dismiss early
//
// Design tokens follow the site's monochrome system. Respects
// prefers-reduced-motion (fade only, no slide).

export type NotifyIcon = 'trophy' | 'copy' | 'flame' | 'check' | 'alert' | 'info';
export type NotifyPoliteness = 'status' | 'alert';

export interface NotifyOptions {
  title: string;
  description?: string;
  icon?: NotifyIcon;
  /** 'status' (default) for info, 'alert' for warnings. Maps to ARIA live roles. */
  politeness?: NotifyPoliteness;
  /** ms before auto-dismiss. 0 = sticky until clicked. Default 4000. */
  duration?: number;
  /** Which edge it slides from. Default 'bottom'. */
  slideFrom?: 'top' | 'bottom';
}

const ICON_SVGS: Record<NotifyIcon, string> = {
  trophy:
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  copy:
    '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  flame:
    '<path d="M12 2c1.5 4.5-4.5 6.5-4.5 11.5a4.5 4.5 0 0 0 9 0C16.5 11 15 9.5 15 9.5s2.5 1.5 2.5 4.5a5.5 5.5 0 0 1-11 0C6.5 8 12 6.5 12 2Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert:
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info:
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
};

const CSS = `
.it-notify-stack { position: fixed; z-index: 9999; display: flex; flex-direction: column; gap: 8px; max-width: min(360px, calc(100vw - 32px)); pointer-events: none; }
.it-notify-stack[data-from="bottom"] { right: 16px; bottom: 16px; align-items: flex-end; }
.it-notify-stack[data-from="top"] { right: 16px; top: 16px; align-items: flex-end; }
.it-notify {
  pointer-events: auto; display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 14px; border-radius: 16px; cursor: pointer;
  background: rgba(255,255,255,.72); color: #1d1d1f;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 12px 32px rgba(0,0,0,.14);
  -webkit-backdrop-filter: blur(14px) saturate(1.4); backdrop-filter: blur(14px) saturate(1.4);
  transform: translateY(12px); opacity: 0;
  transition: transform .28s cubic-bezier(.32,.72,0,1), opacity .22s ease;
  font-family: inherit; max-width: 100%;
}
.dark .it-notify, [data-theme="dark"] .it-notify {
  background: rgba(28,28,30,.72); color: #f5f5f7; border-color: rgba(255,255,255,.1);
  box-shadow: 0 12px 32px rgba(0,0,0,.45);
}
.it-notify-stack[data-from="top"] .it-notify { transform: translateY(-12px); }
.it-notify.it-notify-in { transform: translateY(0); opacity: 1; }
.it-notify.it-notify-out { transform: translateY(8px); opacity: 0; }
.it-notify-icon {
  flex: none; width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.06); color: inherit;
}
.dark .it-notify-icon, [data-theme="dark"] .it-notify-icon { background: rgba(255,255,255,.1); }
.it-notify-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.it-notify-icon[data-icon="trophy"] { color: #b7791f; }
.it-notify-icon[data-icon="flame"] { color: #e8590c; }
.it-notify-icon[data-icon="check"], .it-notify-icon[data-icon="copy"] { color: #0072f5; }
.it-notify-icon[data-icon="alert"] { color: #e03131; }
.it-notify-body { min-width: 0; }
.it-notify-title { font-size: 14px; font-weight: 600; line-height: 1.3; }
.it-notify-desc { font-size: 12.5px; line-height: 1.4; opacity: .65; margin-top: 2px; }
@media (prefers-reduced-motion: reduce) {
  .it-notify { transform: none; transition: opacity .15s ease; }
  .it-notify.it-notify-out { transform: none; }
}
`;

let styleInjected = false;
const stacks = new Map<string, HTMLElement>();

function ensureStyles(): void {
  if (styleInjected) return;
  const el = document.createElement('style');
  el.setAttribute('data-it-notify', '');
  el.textContent = CSS;
  document.head.appendChild(el);
  styleInjected = true;
}

function getStack(slideFrom: 'top' | 'bottom'): HTMLElement {
  const existing = stacks.get(slideFrom);
  if (existing && existing.isConnected) return existing;
  const el = document.createElement('div');
  el.className = 'it-notify-stack';
  el.dataset.from = slideFrom;
  document.body.appendChild(el);
  stacks.set(slideFrom, el);
  return el;
}

function iconSvg(icon: NotifyIcon): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON_SVGS[icon]}</svg>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Show a frosted notification toast. Returns a dismiss function.
 */
export function notify(opts: NotifyOptions): () => void {
  ensureStyles();
  const {
    title,
    description = '',
    icon = 'info',
    politeness = 'status',
    duration = 4000,
    slideFrom = 'bottom',
  } = opts;

  const stack = getStack(slideFrom);
  const el = document.createElement('div');
  el.className = 'it-notify';
  el.setAttribute('role', politeness);
  el.setAttribute('tabindex', '0');
  el.innerHTML =
    `<div class="it-notify-icon" data-icon="${icon}">${iconSvg(icon)}</div>` +
    `<div class="it-notify-body"><div class="it-notify-title">${escapeHtml(title)}</div>` +
    (description ? `<div class="it-notify-desc">${escapeHtml(description)}</div>` : '') +
    `</div>`;

  let dismissed = false;
  let timer: number | undefined;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    if (timer !== undefined) window.clearTimeout(timer);
    el.classList.add('it-notify-out');
    el.classList.remove('it-notify-in');
    window.setTimeout(() => el.remove(), 300);
  };

  el.addEventListener('click', dismiss);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') dismiss();
  });

  stack.appendChild(el);
  // Force reflow so the enter transition runs.
  void el.offsetHeight;
  requestAnimationFrame(() => el.classList.add('it-notify-in'));

  if (duration > 0) {
    timer = window.setTimeout(dismiss, duration);
  }
  return dismiss;
}

/** Dismiss every visible notification immediately. */
export function dismissAllNotifications(): void {
  document.querySelectorAll('.it-notify').forEach((el) => {
    el.classList.add('it-notify-out');
    el.classList.remove('it-notify-in');
    window.setTimeout(() => el.remove(), 300);
  });
}
