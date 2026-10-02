# Progress Tracker

## Current Milestone: Hero Key Glow & Engine Events

- [x] **Step 0: Read and Report & Spec Approval**
  - [x] Full codebase audit of `FloatingKeyboard.astro`, `ParticleHero.astro`, and `TypingEngine.astro`
  - [x] Verification of known facts & mapping details
  - [x] Creation/update of project context files (`project-overview.md`, `architecture.md`, `code-standards.md`, `ai-workflow-rules.md`, `ui-context.md`, `progress-tracker.md`, `CLAUDE.md`)
  - [x] User review and approval of Unit 1 & Unit 2 specifications
- [x] **Unit 1: Blue Glow on Hero Keyboard Keys**
  - [x] Add transition & active blue glow styling for `.kb-cap` on `.pressed` state matching Enter key aesthetics
  - [x] Implement pseudo-element overlay (`.kb-cap::after`) to smoothly transition gradient opacity
  - [x] Implement fast release fade-out and sticky key prevention on window blur / document visibilitychange
  - [x] Guarantee minimum 90ms visible glow with per-key timers and timestamp tracking
  - [x] Ignore keydown events originating from other input/textarea elements or when Ctrl/Meta/Alt modifiers are held
  - [x] Validate Ghost Typing and prefers-reduced-motion compatibility
- [ ] **Unit 2: Typing Engine Event Dispatching**
  - [ ] Create `src/scripts/typing-events.ts` event contract interface
  - [ ] Dispatch `typing-start`, `typing-stop`, `typing-reset` on `window`
  - [ ] Dispatch `typing-key-result`, `typing-backspace`, `typing-next-char`
  - [ ] Fix duplicate `data-i18n-placeholder` on `#custom-text-input`
  - [ ] Validate console event flow & `ParticleHero` pause/resume
