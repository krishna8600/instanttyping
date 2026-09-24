// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Required by @astrojs/sitemap and for canonical URLs.
  site: 'https://practicetesttyping.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
