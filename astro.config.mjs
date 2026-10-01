// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Required by @astrojs/sitemap and for canonical URLs.
  site: 'https://instanttyping.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
// trigger restart
