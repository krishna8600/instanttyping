const fs = require('fs');
let file = fs.readFileSync('src/components/TypingEngine.astro', 'utf8');

// 1. Add CODE_SNIPPETS to imports
file = file.replace('CLASSIC_PASSAGES,', 'CLASSIC_PASSAGES,\n    CODE_SNIPPETS,');

// 2. Fix mode buttons
const oldButtons = `      <button
        type="button"
        data-mode-btn="classics"
        data-i18n="test.mode_classics"
        class="mode-tab-btn relative z-10 px-4 py-1.5 rounded-full font-medium transition-all duration-200 ease-out text-sm"
      >
        Custom
      </button>`;

const newButtons = `      <button
        type="button"
        data-mode-btn="classics"
        data-i18n="test.mode_classics"
        class="mode-tab-btn relative z-10 px-4 py-1.5 rounded-full font-medium transition-all duration-200 ease-out text-sm"
      >
        Classics
      </button>
      <button
        type="button"
        data-mode-btn="custom"
        data-i18n="test.mode_custom"
        class="mode-tab-btn relative z-10 px-4 py-1.5 rounded-full font-medium transition-all duration-200 ease-out text-sm"
      >
        Custom
      </button>
      <button
        type="button"
        data-mode-btn="code"
        data-i18n="test.mode_code"
        class="mode-tab-btn relative z-10 px-4 py-1.5 rounded-full font-medium transition-all duration-200 ease-out text-sm"
      >
        Code
      </button>`;

file = file.replace(oldButtons, newButtons);

// 3. Update the typescript cast
const oldCast = `"time" | "words" | "quote" | "custom" | "classics";`;
const newCast = `"time" | "words" | "quote" | "custom" | "classics" | "code";`;
file = file.replace(oldCast, newCast);

// 4. Update the logic for fetching words
const classicsLogic = `      } else if (currentWordbankName === "classics") {
        const passageObj =
          CLASSIC_PASSAGES[Math.floor(Math.random() * CLASSIC_PASSAGES.length)];
        wordsList = passageObj.text.split(" ");
        quoteCitation.textContent = "- " + passageObj.source + " © Public domain";
        quoteCitation.classList.remove("hidden");
      }`;

const codeLogic = `      } else if (currentWordbankName === "classics") {
        const passageObj =
          CLASSIC_PASSAGES[Math.floor(Math.random() * CLASSIC_PASSAGES.length)];
        wordsList = passageObj.text.split(" ");
        quoteCitation.textContent = "- " + passageObj.source + " © Public domain";
        quoteCitation.classList.remove("hidden");
      } else if (currentMode === "code") {
        const snippetObj =
          CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        wordsList = snippetObj.text.split(" ");
        quoteCitation.textContent = \`</> \${snippetObj.source}\`;
        quoteCitation.classList.remove("hidden");`;

file = file.replace(classicsLogic, codeLogic);

// Wait! In step 4, the existing code uses \`currentMode === "classics"\` for the mode button!
// Let's verify what the code actually looks like.
// At line 1180, it says \`} else if (currentWordbankName === "classics") {\`
// But wait! `currentMode === "classics"` was also on line 1168!
// Let's replace the one for `currentMode === "quote"` to add code.
const quoteLogic = `      } else if (currentMode === "quote" || currentWordbankName === "quote") {
        const quoteObj =
          FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
        wordsList = quoteObj.text.split(" ");
        quoteCitation.textContent = \`- \${quoteObj.source}\`;
        quoteCitation.classList.remove("hidden");
      }`;

const quoteAndCodeLogic = `      } else if (currentMode === "quote" || currentWordbankName === "quote") {
        const quoteObj =
          FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
        wordsList = quoteObj.text.split(" ");
        quoteCitation.textContent = \`- \${quoteObj.source}\`;
        quoteCitation.classList.remove("hidden");
      } else if (currentMode === "code" || currentWordbankName === "code") {
        const snippetObj =
          CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        wordsList = snippetObj.text.split(" ");
        quoteCitation.textContent = \`</> \${snippetObj.source}\`;
        quoteCitation.classList.remove("hidden");
      }`;

file = file.replace(quoteLogic, quoteAndCodeLogic);

// Add "code" to metric mode labels (around line 1600)
// `currentMode === "custom" ? "Custom" : "Quote"`
const oldLabel = `currentMode === "custom"
                ? "Custom"
                : "Quote",`;
const newLabel = `currentMode === "custom"
                ? "Custom"
                : currentMode === "code"
                  ? "Code Snippet"
                  : "Quote",`;

file = file.replace(oldLabel, newLabel);

fs.writeFileSync('src/components/TypingEngine.astro', file);
console.log('Modified TypingEngine.astro for Code Snippets');
