import re

with open("src/components/TypingEngine.astro", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Top of script
script_start = '<script>\n'
guard_code = '''<script>
  if ((window as any).__typingEngineCleanup) {
    (window as any).__typingEngineCleanup();
  }
  const __activeTimeouts: number[] = [];
  const safeSetTimeout = (cb: TimerHandler, ms?: number) => {
    const id = setTimeout(cb, ms) as any;
    __activeTimeouts.push(id);
    return id;
  };
'''
content = content.replace(script_start, guard_code, 1)

# Replace setTimeouts
content = content.replace('setTimeout(() => {', 'safeSetTimeout(() => {')
content = content.replace('setTimeout(resolve, 350)', 'safeSetTimeout(resolve as TimerHandler, 350)')
content = content.replace('setTimeout(() => focusTyping(), 50)', 'safeSetTimeout(() => focusTyping(), 50)')

# 2. Extract keydown
keydown_match = re.search(r'window\.addEventListener\("keydown", \(e\) => \{(.*?)\}\);\n\n    // Item 1:', content, re.DOTALL)
if keydown_match:
    inner = keydown_match.group(1)
    new_keydown = f'''function handleKeydown(e: KeyboardEvent) {{{inner}}}
    window.addEventListener("keydown", handleKeydown);

    // Item 1:'''
    content = content.replace(keydown_match.group(0), new_keydown)

# 3. Extract input
input_match = re.search(r'hiddenInput\.addEventListener\("input", \(e: Event\) => \{(.*?)\}\);\n\n\n    modeBtns', content, re.DOTALL)
if input_match:
    inner = input_match.group(1)
    new_input = f'''function handleInput(e: Event) {{{inner}}}
    hiddenInput.addEventListener("input", handleInput);


    modeBtns'''
    content = content.replace(input_match.group(0), new_input)

# 4. Extract languagechange
lang_match = re.search(r'window\.addEventListener\("instanttyping:languagechange", \(e: any\) => \{(.*?)\}\);\n\n    restartBtn', content, re.DOTALL)
if lang_match:
    inner = lang_match.group(1)
    new_lang = f'''function handleLanguageChange(e: any) {{{inner}}}
    window.addEventListener("instanttyping:languagechange", handleLanguageChange);

    restartBtn'''
    content = content.replace(lang_match.group(0), new_lang)

# 5. ResizeObserver
ro_old = '''    if (typeof ResizeObserver !== "undefined" && typingDisplay) {
      const resizeObserver = new ResizeObserver(onLayoutChange);
      resizeObserver.observe(typingDisplay);
    }'''
ro_new = '''    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && typingDisplay) {
      resizeObserver = new ResizeObserver(onLayoutChange);
      resizeObserver.observe(typingDisplay);
    }'''
content = content.replace(ro_old, ro_new)

# 6. End of script
end_script = '    setTimeout(() => focusTyping(), 50);\n  }\n</script>'
cleanup_code = '''    safeSetTimeout(() => focusTyping(), 50);

    const cleanup = () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("instanttyping:languagechange", handleLanguageChange);
      if (hiddenInput) {
        hiddenInput.removeEventListener("focus", focusTyping);
        hiddenInput.removeEventListener("blur", blurTyping);
        hiddenInput.removeEventListener("input", handleInput);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      __activeTimeouts.forEach(clearTimeout);
    };
    (window as any).__typingEngineCleanup = cleanup;
    document.addEventListener("astro:before-swap", cleanup, { once: true });
  }
</script>'''

content = content.replace('    setTimeout(() => focusTyping(), 50);\n  }\n</script>', cleanup_code)

with open("src/components/TypingEngine.astro", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
