# Code Standards

## Principles
1. **Reuse Ladder:** Check native APIs, repo utilities, and Tailwind before adding any new library or custom abstraction.
2. **Minimal Diffs:** Touch only lines relevant to the specified task. Avoid broad refactoring, formatting cascades, or reordering existing code.
3. **TypeScript Integrity:** Strict typing with descriptive interfaces for state, events, and data structures. Avoid `any` where specific types or generics are possible.
4. **Resilient DOM Lifecycle:** Handle DOM events with proper cleanup or guarded idempotency (`DOMContentLoaded`, `astro:page-load`).
5. **No Layout Shift (CLS 0):** Keep layout dimensions reserved with aspect ratios, min-heights, or fixed containers.
