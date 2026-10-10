import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const msg = url.searchParams.get('msg') || '';
  console.log('BROWSER_LOG:', msg);
  
  try {
    fs.appendFileSync(path.join(process.cwd(), 'browser-logs.txt'), msg + '\n');
  } catch (e) {
    console.error('Failed to write log', e);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
