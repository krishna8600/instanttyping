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
  const testSection = document.getElementById('typing-test-container');
  if (lenis && testSection) {
    const rect = testSection.getBoundingClientRect();
    // Scroll if test section is not already well in view
    if (rect.top < 0 || rect.top > window.innerHeight * 0.5) {
      lenis.scrollTo(testSection, { offset: -20 });
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
