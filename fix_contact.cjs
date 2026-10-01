const fs = require('fs');
let content = fs.readFileSync('./src/pages/contact.astro', 'utf8');

// Fix the error-message div to use contact.error_message key
const oldErrorMsg = '  <div id="error-message" class="text-[11px] text-red-500 hidden">Please provide your <span data-i18n="contact.label_message">Message</span> (min. 10 characters).</div>';
const newErrorMsg = '  <div id="error-message" class="text-[11px] text-red-500 hidden" data-i18n="contact.error_message">Please provide your message (min. 10 characters).</div>';

if (content.includes(oldErrorMsg)) {
  content = content.replace(oldErrorMsg, newErrorMsg);
  fs.writeFileSync('./src/pages/contact.astro', content, 'utf8');
  console.log('Done: error-message div wired to i18n');
} else {
  // Try a simpler approach - replace just the hardcoded text
  const idx = content.indexOf('id="error-message"');
  if (idx >= 0) {
    const end = content.indexOf('</div>', idx);
    const oldDiv = content.substring(idx - 4, end + 6);
    console.log('Found div:', JSON.stringify(oldDiv));
  } else {
    console.log('Pattern not found');
  }
}
