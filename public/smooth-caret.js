/* Smooth caret for Instant Typing — Monkeytype recipe.
 * JavaScript-driven 90ms near-linear tween with mid-flight retargeting.
 * Unlike CSS transitions (which restart their easing curve when retargeted
 * rapidly, causing lag), this tween always starts from the caret's CURRENT
 * visual position — so it stays responsive no matter how fast you type.
 * Respects prefers-reduced-motion: jumps instantly when the user asked
 * for reduced motion. Self-healing: if the engine left the caret invisible
 * (opacity 0 from a blur without refocus), being called means the user is
 * typing, so it restores visibility itself. display:none (results screen)
 * is respected and left alone.
 */
(function () {
  'use strict';

  var el = null;
  var rafId = null;

  // Last rendered position — the tween always starts from here (mid-flight).
  var curX = 0;
  var curY = 0;

  // Tween state
  var fromX = 0;
  var fromY = 0;
  var toX = 0;
  var toY = 0;
  var startTime = 0;
  var DURATION = 90;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function caret() {
    // Re-lookup if the element was replaced (Astro dev hot-reload swaps DOM nodes).
    if (!el || !el.isConnected) el = document.getElementById('typing-caret');
    return el;
  }

  // Near-linear easeInOut, exponent 1.25 (Monkeytype's caret.ts recipe).
  // Power 1.0 would be perfectly linear; 1.25 adds a whisper of easing.
  function ease(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    if (t < 0.5) return Math.pow(2 * t, 1.25) / 2;
    return 1 - Math.pow(2 * (1 - t), 1.25) / 2;
  }

  function write(c, x, y) {
    c.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function frame(c, now) {
    var t = (now - startTime) / DURATION;
    if (t >= 1) {
      // Done — snap exactly to target.
      curX = toX;
      curY = toY;
      write(c, curX, curY);
      rafId = null;
      return;
    }
    var e = ease(t);
    curX = fromX + (toX - fromX) * e;
    curY = fromY + (toY - fromY) * e;
    write(c, curX, curY);
    rafId = requestAnimationFrame(function (n) { frame(c, n); });
  }

  function caretState(c) {
    var cs = window.getComputedStyle(c);
    return {
      // display:none = results screen: intentional, leave alone.
      gone: cs.display === 'none',
      // opacity 0 while displayed = focus-restore bug: engine hid it on blur
      // but never brought it back. Since we're being called, the user is
      // typing, so the caret must be visible — heal it.
      faded: cs.display !== 'none' && parseFloat(cs.opacity || '1') === 0
    };
  }

  window.__smoothCaretTo = function (nx, ny) {
    var c = caret();

    if (!c) return;

    // Guard: ignore bogus off-screen coordinates (engine bug sends x=-1.25
    // in some cases). The next valid call will position correctly.
    if (nx < 0 || !isFinite(nx) || !isFinite(ny)) return;

    var st = caretState(c);

    if (st.gone) {
      // Results screen: park the caret, don't show it.
      stop();
      curX = nx;
      curY = ny;
      write(c, nx, ny);
      return;
    }

    if (st.faded) {
      // Self-heal: user is typing but engine left caret invisible.
      c.style.opacity = '1';
    }

    // Kill the CSS transition — the JS tween owns the motion now.
    // (If a previous version set a transition, remove it so it can't fight us.)
    if (c.style.transition) c.style.transition = 'none';

    if (reduceMotion) {
      // Instant jump, no animation.
      stop();
      curX = nx;
      curY = ny;
      write(c, nx, ny);
      return;
    }

    // Mid-flight retargeting: cancel the old tween, start a new one
    // from the CURRENT visual position (curX/curY), not from the old target.
    // This is what keeps it responsive during fast typing.
    stop();
    fromX = curX;
    fromY = curY;
    toX = nx;
    toY = ny;

    // If we're already there (or extremely close), skip the tween.
    var dx = toX - fromX;
    var dy = toY - fromY;
    if (dx * dx + dy * dy < 0.25) {
      curX = toX;
      curY = toY;
      write(c, curX, curY);
      return;
    }

    startTime = performance.now();
    rafId = requestAnimationFrame(function (n) { frame(c, n); });
  };
})();
