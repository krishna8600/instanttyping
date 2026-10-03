// src/scripts/share-card.ts — Wordle-style shareable result cards
// Generates branded PNG + copy-paste text, no backend, no account

export interface ShareData {
  wpm: number;
  accuracy: number;
  rank: string;
  date: string;
}

const BRAND = {
  bg: '#000000',
  text: '#FFFFFF',
  muted: '#A1A1AA',
  accent: '#0072F5',
  font: 'system-ui, -apple-system, sans-serif',
};

export function generateShareText(data: ShareData): string {
  return `⚡ ${data.wpm} WPM 🎯 ${data.accuracy}% · ${data.rank}\ninstanttyping.com`;
}

export async function generateShareImage(data: ShareData): Promise<Blob> {
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = BRAND.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle accent line at top
  ctx.fillStyle = BRAND.accent;
  ctx.fillRect(0, 0, W, 6);

  // Brand
  ctx.fillStyle = BRAND.muted;
  ctx.font = `600 28px ${BRAND.font}`;
  ctx.textAlign = 'center';
  ctx.fillText('instanttyping.com', W / 2, 80);

  // WPM — hero number
  ctx.fillStyle = BRAND.text;
  ctx.font = `700 160px ${BRAND.font}`;
  ctx.fillText(`${data.wpm}`, W / 2, 280);

  ctx.fillStyle = BRAND.muted;
  ctx.font = `500 32px ${BRAND.font}`;
  ctx.fillText('WORDS PER MINUTE', W / 2, 330);

  // Stats row
  ctx.font = `600 48px ${BRAND.font}`;
  ctx.fillStyle = BRAND.text;
  const y = 450;
  ctx.fillText(`${data.accuracy}%`, W / 2 - 180, y);
  ctx.fillStyle = BRAND.accent;
  ctx.fillText(data.rank, W / 2 + 180, y);

  ctx.fillStyle = BRAND.muted;
  ctx.font = `400 24px ${BRAND.font}`;
  ctx.fillText('ACCURACY', W / 2 - 180, y + 40);
  ctx.fillText('RANK', W / 2 + 180, y + 40);

  // Date
  ctx.fillStyle = BRAND.muted;
  ctx.font = `400 22px ${BRAND.font}`;
  ctx.fillText(data.date, W / 2, H - 50);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

export async function copyShareText(data: ShareData): Promise<void> {
  const text = generateShareText(data);
  await navigator.clipboard.writeText(text);
}

export async function downloadShareImage(data: ShareData): Promise<void> {
  const blob = await generateShareImage(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instanttyping-${data.wpm}wpm.png`;
  a.click();
  URL.revokeObjectURL(url);
}
