// src/scripts/share-card.ts — Monochrome shareable result card & copy text
// Generates 1200x630 monochrome PNG + clipboard text summary.

export interface ShareData {
  wpm: number;
  accuracy: number;
  consistency: number;
  date: string;
  rank?: string;
  quoteAttribution?: string;
  isMobile?: boolean;
}

const BRAND = {
  bg: '#09090B',
  cardBg: '#121215',
  border: '#27272A',
  text: '#FFFFFF',
  muted: '#A1A1AA',
  subtle: '#71717A',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

export function generateShareText(data: ShareData): string {
  let text = `⚡ ${data.wpm} WPM · 🎯 ${data.accuracy}% Accuracy · 📊 ${data.consistency}% Consistency\nTested on ${data.date} at instanttyping.com`;
  if (data.quoteAttribution) {
    text += `\nQuote: ${data.quoteAttribution}`;
  }
  return text;
}

export async function generateShareImage(data: ShareData): Promise<Blob> {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = BRAND.bg;
  ctx.fillRect(0, 0, W, H);

  // Border frame
  ctx.strokeStyle = BRAND.border;
  ctx.lineWidth = 2;
  const pad = 28;
  const r = 16;
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, r);
  ctx.stroke();

  // Top Accent Bar (Monochrome subtle line)
  ctx.fillStyle = '#3F3F46';
  ctx.fillRect(W / 2 - 40, pad + 16, 80, 3);

  // Header Brand
  ctx.fillStyle = BRAND.muted;
  ctx.font = `600 24px ${BRAND.font}`;
  ctx.textAlign = 'center';
  ctx.fillText('INSTANTTYPING.COM', W / 2, 100);

  // Hero WPM Number
  ctx.fillStyle = BRAND.text;
  ctx.font = `700 160px ${BRAND.font}`;
  ctx.fillText(String(data.wpm), W / 2, 280);

  ctx.fillStyle = BRAND.muted;
  ctx.font = `600 22px ${BRAND.font}`;
  ctx.fillText('WORDS PER MINUTE', W / 2, 330);

  // Horizontal divider
  ctx.strokeStyle = '#1F1F23';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 375);
  ctx.lineTo(W - 120, 375);
  ctx.stroke();

  // 3 Stats Columns: Accuracy, Consistency, Date
  const colY = 445;
  const subY = 485;

  // Column 1: Accuracy
  ctx.textAlign = 'center';
  ctx.fillStyle = BRAND.text;
  ctx.font = `700 46px ${BRAND.font}`;
  ctx.fillText(`${data.accuracy}%`, 300, colY);
  ctx.fillStyle = BRAND.subtle;
  ctx.font = `600 18px ${BRAND.font}`;
  ctx.fillText('ACCURACY', 300, subY);

  // Vertical divider 1
  ctx.beginPath();
  ctx.moveTo(450, 410);
  ctx.lineTo(450, 500);
  ctx.stroke();

  // Column 2: Consistency
  ctx.fillStyle = BRAND.text;
  ctx.font = `700 46px ${BRAND.font}`;
  ctx.fillText(`${data.consistency}%`, 600, colY);
  ctx.fillStyle = BRAND.subtle;
  ctx.font = `600 18px ${BRAND.font}`;
  ctx.fillText('CONSISTENCY', 600, subY);

  // Vertical divider 2
  ctx.beginPath();
  ctx.moveTo(750, 410);
  ctx.lineTo(750, 500);
  ctx.stroke();

  // Column 3: Date
  ctx.fillStyle = BRAND.text;
  ctx.font = `600 32px ${BRAND.font}`;
  ctx.fillText(data.date, 900, colY - 5);
  ctx.fillStyle = BRAND.subtle;
  ctx.font = `600 18px ${BRAND.font}`;
  ctx.fillText('DATE', 900, subY);

  // Quote attribution if in Quote mode
  if (data.quoteAttribution) {
    ctx.fillStyle = BRAND.muted;
    ctx.font = `italic 500 20px ${BRAND.font}`;
    ctx.textAlign = 'center';
    let attr = data.quoteAttribution;
    if (attr.length > 75) attr = attr.slice(0, 72) + '...';
    ctx.fillText(attr, W / 2, 505);
  }

  // Device badge (mobile vs desktop)
  const isMobile = data.isMobile ?? false;
  const badgeX = W / 2;
  const badgeY = H - 115;
  ctx.strokeStyle = BRAND.subtle;
  ctx.fillStyle = BRAND.subtle;
  ctx.lineWidth = 2;
  if (isMobile) {
    ctx.beginPath();
    ctx.roundRect(badgeX - 8, badgeY - 14, 16, 28, 4);
    ctx.stroke();
    ctx.fillRect(badgeX - 4, badgeY - 10, 8, 2);
  } else {
    ctx.beginPath();
    ctx.roundRect(badgeX - 16, badgeY - 12, 32, 20, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(badgeX - 5, badgeY + 8);
    ctx.lineTo(badgeX + 5, badgeY + 8);
    ctx.moveTo(badgeX, badgeY + 8);
    ctx.lineTo(badgeX, badgeY + 12);
    ctx.moveTo(badgeX - 9, badgeY + 12);
    ctx.lineTo(badgeX + 9, badgeY + 12);
    ctx.stroke();
  }
  ctx.font = `600 16px ${BRAND.font}`;
  ctx.textAlign = 'center';
  ctx.fillText(isMobile ? 'Taken on Mobile' : 'Taken on Desktop', badgeX, badgeY + 32);

  // Footer Tagline
  ctx.fillStyle = BRAND.subtle;
  ctx.font = `400 18px ${BRAND.font}`;
  ctx.fillText('Standard 5-keystroke international metric · Verified in browser', W / 2, H - 45);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

export async function copyShareText(data: ShareData): Promise<boolean> {
  const text = generateShareText(data);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

export async function downloadShareImage(data: ShareData): Promise<void> {
  const blob = await generateShareImage(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instanttyping-${data.wpm}wpm.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
