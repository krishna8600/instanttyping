with open("src/components/TypingEngine.astro", "r", encoding="utf-8") as f:
    content = f.read()

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

content = content.replace('    safeSetTimeout(() => focusTyping(), 50);\n  }\n</script>', cleanup_code)

with open("src/components/TypingEngine.astro", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
