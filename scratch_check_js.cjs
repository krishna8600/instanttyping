const fs = require('fs');

const metricsPath = 'src/utils/metrics.ts';
if (fs.existsSync(metricsPath)) {
  console.log('--- metrics.ts strings ---');
  const metrics = fs.readFileSync(metricsPath, 'utf8');
  console.log(metrics.match(/`.*?`/g));
  console.log(metrics.match(/'.*?' *\+/g) || []);
  console.log(metrics.match(/".*?" *\+/g) || []);
}

const enginePath = 'src/components/TypingEngine.astro';
if (fs.existsSync(enginePath)) {
  console.log('--- TypingEngine.astro strings ---');
  const engine = fs.readFileSync(enginePath, 'utf8');
  console.log(engine.match(/`.*?`/g));
}
