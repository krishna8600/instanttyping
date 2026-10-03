import Lenis from 'lenis';

if ((window as any).__lenisCleanup) {
  (window as any).__lenisCleanup();
}

let lenis: Lenis | undefined;
let rafId: number | undefined;

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  (window as any).__lenis = lenis;

  function raf(time: number) {
    if (lenis) lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);
} else {
  (window as any).__lenis = undefined;
}

function handleTypingStart() {
  // Scroll to the WORDS (not the container top) so the words viewport
  // and the guided keyboard below it land together in the viewport.
  // Scrolling to #typing-test-container puts the big heading at the top,
  // which pushes the keyboard below the fold.
  const wordsEl = document.getElementById('typing-surface-wrapper');
  const keyboardEl = document.getElementById('gk-root');
  if (lenis && wordsEl) {
    const wordsRect = wordsEl.getBoundingClientRect();
    const kbRect = keyboardEl?.getBoundingClientRect();
    const keyboardOutOfView = kbRect ? kbRect.bottom > window.innerHeight + 40 : false;
    const wordsNotWellInView = wordsRect.top < 0 || wordsRect.top > window.innerHeight * 0.4;
    // Scroll if words aren't well placed OR the keyboard is cut off below
    if (wordsNotWellInView || keyboardOutOfView) {
      lenis.scrollTo(wordsEl, { offset: -16 });
    }
  }
}

window.addEventListener('typing-start', handleTypingStart);

function handleCTAClick(e: MouseEvent) {
  const testSection = document.getElementById('typing-test-container');
  if (testSection) {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(testSection, { offset: -20 });
    } else {
      testSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function attachCTA() {
  const cta = document.querySelector('a[href="#typing-test-container"]');
  if (cta) {
    cta.addEventListener('click', handleCTAClick as EventListener);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachCTA);
} else {
  attachCTA();
}
document.addEventListener('astro:page-load', attachCTA);

function cleanup() {
  if (rafId !== undefined) {
    cancelAnimationFrame(rafId);
  }
  if (lenis) {
    lenis.destroy();
  }
  (window as any).__lenis = undefined;
  window.removeEventListener('typing-start', handleTypingStart);
  
  const cta = document.querySelector('a[href="#typing-test-container"]');
  if (cta) {
    cta.removeEventListener('click', handleCTAClick as EventListener);
  }
  document.removeEventListener('astro:before-swap', cleanup);
}

(window as any).__lenisCleanup = cleanup;
document.addEventListener('astro:before-swap', cleanup, { once: true });
