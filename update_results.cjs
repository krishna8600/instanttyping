const fs = require('fs');
let content = fs.readFileSync('src/components/TypingEngine.astro', 'utf8');

const startMarker = '<div id="results-modal" class="hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">';
const endMarker = '<!-- Skill Certificate Modal -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers");
  process.exit(1);
}

const newHTML = `<!-- Premium Apple-Style Results Panel -->
 <div id="results-modal" class="hidden w-full mt-6 animate-spring-enter">
 <div class="w-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-3xl p-8 sm:p-10 space-y-10 text-neutral-900 dark:text-neutral-50">
 
 <!-- Header -->
 <div class="flex flex-col items-center justify-center text-center space-y-2 border-b border-black/5 dark:border-white/10 pb-8">
 <span class="text-xs font-mono tracking-widest text-sky-500 font-semibold uppercase" id="res-badge">Test Completed</span>
 <h2 class="text-3xl sm:text-5xl font-semibold tracking-tight text-balance" id="res-rank-title">High-Speed Professional</h2>
 <p class="text-sm text-neutral-500 dark:text-neutral-400 font-medium" id="res-percentile">Top 7% worldwide</p>
 </div>

 <!-- Main Score Grid -->
 <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
 <div class="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/5 shadow-sm">
 <div class="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Net Speed</div>
 <div class="text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums text-sky-500" id="res-net-wpm">0</div>
 <div class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-medium">WPM</div>
 </div>
 <div class="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/5 shadow-sm">
 <div class="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Accuracy</div>
 <div class="text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums" id="res-accuracy">100%</div>
 <div class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-medium">PRECISION</div>
 </div>
 <div class="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/5 shadow-sm">
 <div class="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Raw Speed</div>
 <div class="text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums" id="res-raw-wpm">0</div>
 <div class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-medium">GROSS WPM</div>
 </div>
 <div class="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/5 shadow-sm">
 <div class="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Consistency</div>
 <div class="text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums" id="res-consistency">95%</div>
 <div class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 font-medium">STABILITY</div>
 </div>
 </div>

 <!-- Character Breakdown Row -->
 <div class="p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5 flex flex-wrap items-center justify-around gap-4 text-xs font-mono font-medium">
 <div class="flex items-center gap-2"><span class="text-neutral-500 dark:text-neutral-400">Correct Chars:</span> <strong class="text-emerald-500 text-sm" id="res-correct-chars">0</strong></div>
 <div class="flex items-center gap-2"><span class="text-neutral-500 dark:text-neutral-400">Errors:</span> <strong class="text-rose-500 text-sm" id="res-error-chars">0</strong></div>
 <div class="flex items-center gap-2"><span class="text-neutral-500 dark:text-neutral-400">Total Keystrokes:</span> <strong class="text-sm" id="res-total-keystrokes">0</strong></div>
 <div class="flex items-center gap-2"><span class="text-neutral-500 dark:text-neutral-400">Duration:</span> <strong class="text-sm" id="res-time-elapsed">60s</strong></div>
 </div>

 <!-- Live Speed Progression Timeline (SVG Line Graph) -->
 <div class="space-y-4">
 <div class="text-[11px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest text-center">Speed Progression</div>
 <div class="w-full h-36 rounded-2xl bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/5 p-4 flex items-center justify-center shadow-inner">
 <svg id="timeline-chart-svg" class="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
 <!-- Dynamic path rendered in JS -->
 </svg>
 </div>
 </div>

 <!-- Weak-Key Diagnostic Section -->
 <div id="weak-keys-section" class="space-y-4 mt-8">
 <div class="text-[11px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest text-center">Weak-Key Diagnostic</div>
 <div id="weak-keys-list" class="flex flex-wrap items-center justify-center gap-3 text-sm font-mono min-h-[40px]">
 <span class="text-neutral-400">Zero errors registered. Flawless run!</span>
 </div>
 </div>

 <!-- Action Buttons -->
 <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-black/5 dark:border-white/10">
 <button
 id="btn-modal-restart"
 type="button"
 class="w-full sm:w-auto h-12 px-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-105 transition-transform shadow-lg"
 >
 Restart Test
 </button>
 
 <button
 id="btn-train-mistakes"
 type="button"
 class="hidden w-full sm:w-auto h-12 px-8 rounded-full bg-rose-500 text-white font-semibold text-sm hover:scale-105 transition-transform shadow-lg"
 >
 Train My Mistakes
 </button>

 <button
 id="btn-open-certificate"
 type="button"
 class="w-full sm:w-auto h-12 px-8 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white font-semibold text-sm transition-all"
 >
 View Certificate
 </button>
 </div>
 </div>
 </div>

 `;

content = content.slice(0, startIndex) + newHTML + content.slice(endIndex);

// Update JS for hiding typing test on finish
const finishTestMarker = 'function finishTest() {';
const finishTestIndex = content.indexOf(finishTestMarker);
if (finishTestIndex !== -1) {
  content = content.replace(finishTestMarker, finishTestMarker + `
  testActive = false;
  testCompleted = true;
  document.getElementById('typing-display').classList.add('hidden');
  document.getElementById('focus-prompt').classList.add('hidden');
  document.querySelector('.metric-card')?.parentElement?.classList.add('hidden');
  `);
}

const resetTestMarker = 'function resetTest() {';
const resetTestIndex = content.indexOf(resetTestMarker);
if (resetTestIndex !== -1) {
  content = content.replace(resetTestMarker, resetTestMarker + `
  document.getElementById('typing-display').classList.remove('hidden');
  document.querySelector('.metric-card')?.parentElement?.classList.remove('hidden');
  resultsModal.classList.add('hidden');
  document.getElementById('focus-prompt').classList.remove('hidden');
  `);
}

// Fix heatmap classes to look good
content = content.replace(/badge.className = 'px-2 py-1 rounded bg-red-100 text-red-700 font-mono text-xs border border-red-200 ';/g,
"badge.className = 'px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-semibold border border-rose-500/20';");

fs.writeFileSync('src/components/TypingEngine.astro', content);
console.log('Results panel updated to Apple design');
