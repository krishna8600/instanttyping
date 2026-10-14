import { describe, it } from 'node:test';
import assert from 'node:assert';
import { countUp } from './count-up.ts';

describe('countUp utility', () => {
  it('resolves instantly when reduced motion is preferred', () => {
    const el = { textContent: '' } as unknown as HTMLElement;
    // Mock window.matchMedia to return matches: true
    (globalThis as any).window = {
      matchMedia: (query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
      }),
    };

    let doneCalled = false;
    countUp(el, 85, { onDone: () => { doneCalled = true; } });

    assert.strictEqual(el.textContent, '85');
    assert.strictEqual(doneCalled, true);
  });

  it('formats prefix, suffix, and decimals correctly under instant resolution', () => {
    const el = { textContent: '' } as unknown as HTMLElement;
    (globalThis as any).window = {
      matchMedia: () => ({ matches: true }),
    };

    countUp(el, 98.4, { prefix: '+', suffix: '%', decimals: 1 });
    assert.strictEqual(el.textContent, '+98.4%');

    countUp(el, 150, { prefix: '+', suffix: ' XP' });
    assert.strictEqual(el.textContent, '+150 XP');
  });

  it('resolves immediately when duration is 0', () => {
    const el = { textContent: '' } as unknown as HTMLElement;
    (globalThis as any).window = {
      matchMedia: () => ({ matches: false }),
    };

    countUp(el, 60, { duration: 0 });
    assert.strictEqual(el.textContent, '60');
  });

  it('handles NaN target gracefully', () => {
    const el = { textContent: '' } as unknown as HTMLElement;
    (globalThis as any).window = {
      matchMedia: () => ({ matches: false }),
    };

    countUp(el, NaN);
    assert.strictEqual(el.textContent, '0');
  });
});
