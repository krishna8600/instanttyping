/**
 * src/scripts/confirm-morph.ts
 * In-place destructive confirmation: button -> inline question -> result.
 * Vanilla TypeScript, zero dependencies.
 * Companion: src/styles/confirm-morph.css
 *
 * Usage (P1 "Delete my data"):
 *   import { createConfirmMorph } from './confirm-morph';
 *   const el = createConfirmMorph({
 *     idleLabel: 'Delete my data',
 *     confirmText: 'Delete everything? This cannot be undone.',
 *     onConfirm: () => wipeProfile(),
 *   });
 *   container.appendChild(el);
 *
 * Faces crossfade inside a fixed box (no layout shift). Focus moves to the
 * safe action when the question appears. Screen readers get live updates.
 */

export interface ConfirmMorphOptions {
  idleLabel: string;
  confirmText: string;
  yesLabel?: string;
  noLabel?: string;
  doneLabel?: string;
  /** ms before returning to idle after done. Default 2600. */
  resetAfterMs?: number;
  className?: string;
  onConfirm: () => void | Promise<void>;
}

export function createConfirmMorph(options: ConfirmMorphOptions): HTMLElement {
  const {
    idleLabel,
    confirmText,
    yesLabel = 'Yes, delete',
    noLabel = 'Keep',
    doneLabel = 'Deleted',
    resetAfterMs = 2600,
    className = '',
    onConfirm,
  } = options;

  const root = document.createElement('span');
  root.className = ['cmorph', className].filter(Boolean).join(' ');
  root.dataset.state = 'idle';

  // Idle face
  const idleFace = document.createElement('span');
  idleFace.className = 'cmorph-face cmorph-idle';
  const idleBtn = document.createElement('button');
  idleBtn.type = 'button';
  idleBtn.className = 'cmorph-btn';
  idleBtn.textContent = idleLabel;
  idleFace.appendChild(idleBtn);

  // Confirm face
  const confirmFace = document.createElement('span');
  confirmFace.className = 'cmorph-face cmorph-confirm';
  const qText = document.createElement('span');
  qText.className = 'cmorph-text';
  qText.textContent = confirmText;
  const yesBtn = document.createElement('button');
  yesBtn.type = 'button';
  yesBtn.className = 'cmorph-btn cmorph-yes';
  yesBtn.textContent = yesLabel;
  const noBtn = document.createElement('button');
  noBtn.type = 'button';
  noBtn.className = 'cmorph-btn';
  noBtn.textContent = noLabel;
  confirmFace.append(qText, yesBtn, noBtn);

  // Done face
  const doneFace = document.createElement('span');
  doneFace.className = 'cmorph-face cmorph-done';
  doneFace.textContent = doneLabel;

  // Live region for screen readers
  const sr = document.createElement('span');
  sr.className = 'ac-sr';
  sr.setAttribute('role', 'status');
  sr.setAttribute('aria-live', 'polite');

  root.append(idleFace, confirmFace, doneFace, sr);

  let timer: ReturnType<typeof setTimeout> | undefined;
  const setState = (s: 'idle' | 'confirm' | 'done'): void => {
    root.dataset.state = s;
    sr.textContent = s === 'confirm' ? confirmText : s === 'done' ? doneLabel : '';
  };

  idleBtn.addEventListener('click', () => {
    window.clearTimeout(timer);
    setState('confirm');
    // Focus the safe action by default.
    noBtn.focus();
  });

  noBtn.addEventListener('click', () => {
    window.clearTimeout(timer);
    setState('idle');
    idleBtn.focus();
  });

  yesBtn.addEventListener('click', () => {
    (async () => {
      try {
        await onConfirm();
      } finally {
        setState('done');
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setState('idle'), resetAfterMs);
      }
    })();
  });

  // Escape backs out of the question.
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.dataset.state === 'confirm') {
      e.stopPropagation();
      window.clearTimeout(timer);
      setState('idle');
      idleBtn.focus();
    }
  });

  return root;
}
