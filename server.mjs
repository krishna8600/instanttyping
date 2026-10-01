import { preview } from 'astro';

const server = await preview({
  root: '.',
  server: { host: '127.0.0.1', port: 4321 }
});

console.log('Astro preview server is live on http://127.0.0.1:4321');
