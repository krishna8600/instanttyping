/**
 * src/scripts/heatmap.ts
 * GitHub-style practice heatmap for the /profile page.
 * Vanilla TypeScript, zero dependencies. ~370 static cells max.
 * Companion: src/styles/heatmap.css
 *
 * Usage:
 *   import { renderHeatmap } from './heatmap';
 *   // days: chronological [{ date: '2026-10-11', count: 3 }, ...]
 *   renderHeatmap(document.getElementById('practice-map'), days, { weeks: 26 });
 *
 * Data wiring (streak-day history from the it_profile_v1 store) happens in
 * the profile page; this module only renders. Cells get native tooltips and
 * the grid exposes a summary label for screen readers.
 */

import { t, type SupportedLanguage } from '../i18n';

export interface HeatmapDay {
  /** ISO date 'YYYY-MM-DD'. */
  date: string;
  /** Tests completed that day. */
  count: number;
}

export interface HeatmapOptions {
  /** Weeks to show (default 26). */
  weeks?: number;
  /** Count that maps to the darkest step; defaults to the peak in the data. */
  max?: number;
  lang?: SupportedLanguage;
}

export function renderHeatmap(el: HTMLElement, days: HeatmapDay[], opts: HeatmapOptions = {}): void {
  const { weeks = 26, max, lang = 'en' } = opts;
  const slice = days.slice(-weeks * 7);

  const peak = max ?? Math.max(1, ...slice.map((d) => d.count));
  const active = slice.filter((d) => d.count > 0).length;

  el.classList.add('hmap');
  el.textContent = '';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', t('profile.heatmap_aria', lang, { active, weeks }) || `${active} active days in the last ${weeks} weeks`);

  slice.forEach((d, i) => {
    const c = document.createElement('span');
    c.className = 'hmap-cell';
    const step = d.count === 0 ? 0 : Math.min(4, Math.ceil((d.count / peak) * 4));
    c.dataset.step = String(step);
    c.style.setProperty('--i', String(Math.min(i, 175)));
    const date = new Date(`${d.date}T00:00:00`);
    const dateStr = Number.isNaN(date.getTime())
      ? d.date
      : date.toLocaleDateString(lang, { month: 'short', day: 'numeric', year: 'numeric' });
    const tooltipKey = d.count === 1 ? 'profile.heatmap_tooltip_single' : 'profile.heatmap_tooltip';
    c.title = t(tooltipKey, lang, { count: d.count, date: dateStr }) || `${d.count} test${d.count === 1 ? '' : 's'} on ${dateStr}`;
    el.appendChild(c);
  });
}

