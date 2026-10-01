const fs = require('fs');
let content = fs.readFileSync('src/components/TypingEngine.astro', 'utf8');

// 1. Fix dark mode on select options
content = content.replace(/<option class="dark:bg-\[#1D1D1F\]" /g, '<option '); // remove if already there
content = content.replace(/<option value=/g, '<option class="dark:bg-[#1D1D1F]" value=');

// 2. Add animate-spring-enter for smooth option switching
content = content.replace(/id="time-options" class="(.*?)"/g, 'id="time-options" class="$1 animate-spring-enter"');
content = content.replace(/id="words-options" class="(.*?)"/g, 'id="words-options" class="$1 animate-spring-enter"');

content = content.replace(/id="custom-text-container" class="hidden flex-col gap-3 apple-card"/g, 
  'id="custom-text-container" class="hidden flex-col gap-3 apple-card animate-spring-enter"');

// 3. Improve transitions on buttons
content = content.replace(/transition-colors/g, 'transition-all duration-200 ease-out');

// Clean up duplicate animate-spring-enter if ran multiple times
content = content.replace(/animate-spring-enter animate-spring-enter/g, 'animate-spring-enter');

fs.writeFileSync('src/components/TypingEngine.astro', content);
console.log('Fixed options UI');
