# Architecture & Invariants

## Architecture
- **Astro SSG:** Pre-rendered static pages with zero SSR node runtime. All interactive functionality runs in the browser.
- **Client-Side Islands:**
  - `Header.astro` & `LanguageSwitcher.astro`: Handles navigation, dark/light theme persistence (`localStorage`), key sounds mute/volume, and locale switching.
  - `ParticleHero.astro` & `FloatingKeyboard.astro`: Hero canvas starfield (Canvas 2D) and interactive CSS 3D keyboard reflecting physical keystrokes with parallax tilt and ghost typing.
  - `TypingEngine.astro`: Encapsulates test timers, word generation, keystroke measurement, audio clicks, error tracking, and canvas-rendered certificates.
  - `MoonlitBackground.astro`: WebGL canvas for dark-mode water surface rendering.
  - `smooth-scroll.ts`: Global Lenis instance for smooth scrolling.

## Architectural Invariants
1. **Client-Side i18n Rule:** Astro static builds cannot read `localStorage` at build time. Never pass static translated strings as props; pass translation keys and use `data-i18n` attributes for dynamic `updateDOM()` translation.
2. **Keystroke Performance Invariant:** The typing input path must never perform DOM queries (`querySelector`), reflow measurements (`getBoundingClientRect`), or heavy allocations during hot keystroke handling. Use pre-allocated arrays and cached nodes (`cachedCharNodes`, `cachedWordNodes`).
3. **Audio Gesture Synchronization:** AudioContext methods must be invoked synchronously inside direct user gesture handlers prior to dynamic module imports.
4. **Vite Dynamic Import Caching:** If Vite dev server cache corrupts for lazy modules like Tone.js, touch `astro.config.mjs` to force a clean reload.
5. **No Backend / No Auth:** Everything is stored locally via `localStorage` (test history, sound theme, language preference, theme setting).
