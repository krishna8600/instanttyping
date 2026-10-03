const fs = require('fs');
let text = fs.readFileSync('src/components/TypingEngine.astro', 'utf8');

// The modeBtns don't have font-semibold in the same order, they have it at the end:
// b.classList.remove("bg-[#1D1D1F]", "text-white", "dark:bg-white", "dark:text-black", "font-semibold")
text = text.replace(/"bg-\[#1D1D1F\]"/g, '"!bg-[#1D1D1F]"');
text = text.replace(/"text-white"/g, '"!text-white"');
text = text.replace(/"dark:bg-white"/g, '"dark:!bg-white"');
text = text.replace(/"dark:text-black"/g, '"dark:!text-black"');

// But wait! If I just replace all of these exact JS string matches, it will hit ONLY the JS arrays, because in HTML they don't have quotes around them!
// Let's verify by checking if there's any unwanted matches.
// Actually, earlier I saw there are NO other occurrences of `"bg-[#1D1D1F]"` in the file.
fs.writeFileSync('src/components/TypingEngine.astro', text);
console.log('Fixed button classes in TypingEngine.astro');
