const fs = require('fs');

const attrs = [
  { file: 'src/components/CookieConsent.astro', target: 'aria-label="Cookie Preferences"', rep: 'aria-label="Cookie Preferences" data-i18n-aria-label="cookie.aria_preferences"' },
  { file: 'src/components/Header.astro', target: 'aria-label="Site header"', rep: 'aria-label="Site header" data-i18n-aria-label="header.aria_site"' },
  { file: 'src/components/Header.astro', target: 'aria-label="Instant Typing — Home"', rep: 'aria-label="Instant Typing — Home" data-i18n-aria-label="header.aria_home"' },
  { file: 'src/components/Header.astro', target: 'aria-label="Main Navigation"', rep: 'aria-label="Main Navigation" data-i18n-aria-label="header.aria_main_nav"' },
  { file: 'src/components/Header.astro', target: 'title="Toggle key sounds (click to toggle, hold or click arrow for volume)"', rep: 'title="Toggle key sounds" data-i18n-title="header.title_sound"' },
  { file: 'src/components/Header.astro', target: 'aria-label="Volume control popover"', rep: 'aria-label="Volume control popover" data-i18n-aria-label="header.aria_volume_popover"' },
  { file: 'src/components/Header.astro', target: 'title="Toggle Light / Dark Mode"', rep: 'title="Toggle Light / Dark Mode" data-i18n-title="header.title_theme"' },
  { file: 'src/components/LanguageSwitcher.astro', target: 'aria-label="Select language"', rep: 'aria-label="Select language" data-i18n-aria-label="switcher.aria_select"' },
  { file: 'src/components/LanguageSwitcher.astro', target: 'aria-label="Languages"', rep: 'aria-label="Languages" data-i18n-aria-label="switcher.aria_languages"' },
  { file: 'src/components/TypingEngine.astro', target: 'placeholder="Paste or type your custom text here..."', rep: 'placeholder="Paste or type your custom text here..." data-i18n-placeholder="engine.placeholder_custom"' },
  { file: 'src/components/TypingEngine.astro', target: 'aria-label="Typing test text area. Click or press any key to type."', rep: 'aria-label="Typing test text area" data-i18n-aria-label="engine.aria_textarea"' },
  { file: 'src/components/TypingEngine.astro', target: 'aria-label="Test results"', rep: 'aria-label="Test results" data-i18n-aria-label="engine.aria_results"' },
  { file: 'src/components/TypingEngine.astro', target: 'aria-label="WPM over time"', rep: 'aria-label="WPM over time" data-i18n-aria-label="engine.aria_wpm_chart"' },
];

attrs.forEach(a => {
  let content = fs.readFileSync(a.file, 'utf8');
  content = content.replace(a.target, a.rep);
  fs.writeFileSync(a.file, content);
});
console.log('UI attrs wired.');
