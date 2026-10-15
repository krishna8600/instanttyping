/**
 * src/scripts/copy-button.ts
 * Animated copy button — vanilla TypeScript, zero dependencies.
 * Companion: src/styles/copy-button.css (import it once, e.g. from global.css).
 *
 * Usage:
 *   import { createCopyButton } from './copy-button';
 *   const btn = createCopyButton({
 *     idleLabel: 'Copy Results',
 *     doneLabel: 'Copied!',
 *     getValue: () => buildResultsText(),
 *   });
 *   container.appendChild(btn);
 *
 * The button handles clipboard + fallback, the drawn-check animation,
 * the label swap (no layout shift — widest label is reserved up front),
 * and screen-reader announcements. It resets to idle after `resetAfterMs`.
 */

export type CopyButtonState = 'idle' | 'copied' | 'error';

export interface CopyButtonOptions {
  /** Text shown at rest. Default 'Copy'. */
  idleLabel?: string;
  /** Text shown after a successful copy. Default 'Copied'. */
  doneLabel?: string;
  /** Text shown when copying fails. Default 'Failed'. */
  errorLabel?: string;
  /** ms before the button returns to idle. Default 2000. */
  resetAfterMs?: number;
  /** Extra class(es) for the button element. */
  className?: string;
  /** Returns the text to copy. May be async. */
  getValue: () => string | Promise<string>;
  /** Optional state observer. */
  onStateChange?: (state: CopyButtonState) => void;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgIcon(kind: 'copy' | 'check' | 'alert'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add(kind === 'copy' ? 'cpb-glyph-copy' : kind === 'check' ? 'cpb-glyph-check' : 'cpb-glyph-alert');

  if (kind === 'copy') {
    const r1 = document.createElementNS(SVG_NS, 'rect');
    r1.setAttribute('x', '9');
    r1.setAttribute('y', '9');
    r1.setAttribute('width', '12');
    r1.setAttribute('height', '12');
    r1.setAttribute('rx', '2');
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');
    svg.append(r1, p);
  } else if (kind === 'check') {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', 'M4 12l5 5L20 6');
    p.setAttribute('pathLength', '1');
    svg.appendChild(p);
  } else {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', '12');
    c.setAttribute('cy', '12');
    c.setAttribute('r', '10');
    const l1 = document.createElementNS(SVG_NS, 'line');
    l1.setAttribute('x1', '12');
    l1.setAttribute('y1', '8');
    l1.setAttribute('x2', '12');
    l1.setAttribute('y2', '12');
    const l2 = document.createElementNS(SVG_NS, 'line');
    l2.setAttribute('x1', '12');
    l2.setAttribute('y1', '16');
    l2.setAttribute('x2', '12.01');
    l2.setAttribute('y2', '16');
    svg.append(c, l1, l2);
  }
  return svg;
}

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to textarea execCommand fallback
    }
  }
  // Fallback for older browsers / non-secure contexts.
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } finally {
    ta.remove();
  }
  if (!ok) throw new Error('copy command failed');
}

export function createCopyButton(options: CopyButtonOptions): HTMLButtonElement {
  const {
    idleLabel = 'Copy',
    doneLabel = 'Copied',
    errorLabel = 'Failed',
    resetAfterMs = 2000,
    className = '',
    getValue,
    onStateChange,
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = ['cpb-button', className].filter(Boolean).join(' ');
  button.dataset.state = 'idle';
  button.setAttribute('aria-label', idleLabel);

  // Reserve the widest label so the button never jumps.
  const longest = [idleLabel, doneLabel, errorLabel].reduce((a, b) => (a.length >= b.length ? a : b));

  const icon = document.createElement('span');
  icon.className = 'cpb-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.append(svgIcon('copy'), svgIcon('check'), svgIcon('alert'));

  const label = document.createElement('span');
  label.className = 'cpb-label';
  label.setAttribute('aria-hidden', 'true');
  const sizer = document.createElement('span');
  sizer.className = 'cpb-sizer';
  sizer.textContent = longest;
  const idle = document.createElement('span');
  idle.className = 'cpb-text-idle';
  idle.textContent = idleLabel;
  const done = document.createElement('span');
  done.className = 'cpb-text-done';
  done.textContent = doneLabel;
  const err = document.createElement('span');
  err.className = 'cpb-text-error';
  err.textContent = errorLabel;
  label.append(sizer, idle, done, err);

  const sr = document.createElement('span');
  sr.className = 'cpb-sr';
  sr.setAttribute('role', 'status');
  sr.setAttribute('aria-live', 'polite');

  button.append(icon, label, sr);

  let state: CopyButtonState = 'idle';
  let timer: number | undefined;

  function setState(next: CopyButtonState): void {
    state = next;
    button.dataset.state = next;
    sr.textContent =
      next === 'copied' ? `${idleLabel}: Copied` : next === 'error' ? `${idleLabel}: Could not copy` : '';
    onStateChange?.(next);
  }

  button.addEventListener('click', () => {
    if (state !== 'idle') return;
    (async () => {
      try {
        const value = await getValue();
        await writeClipboard(value);
        setState('copied');
      } catch {
        setState('error');
      } finally {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setState('idle'), resetAfterMs);
      }
    })();
  });

  return button;
}
