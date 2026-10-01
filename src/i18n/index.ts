import en from "./en.json";
import es from "./es.json";
import ja from "./ja.json";
import fr from "./fr.json";
import de from "./de.json";
import pt from "./pt.json";
import ko from "./ko.json";
import it from "./it.json";

export type SupportedLanguage = "en" | "es" | "ja" | "fr" | "de" | "pt" | "ko" | "it";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ja", name: "日本語" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ko", name: "한국어" },
  { code: "it", name: "Italiano" },
];

export const DICTIONARIES: Record<SupportedLanguage, Record<string, string>> = {
  en,
  es,
  ja,
  fr,
  de,
  pt,
  ko,
  it,
};

export const STORAGE_KEY = "instanttyping_lang";
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

export function getLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && DICTIONARIES[saved]) {
        currentLanguage = saved;
      }
    } catch {}
  }
  return currentLanguage;
}

export function t(key: string, lang: SupportedLanguage = getLanguage()): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANGUAGE];
  if (dict && dict[key]) {
    return dict[key];
  }
  // Fallback to English, never blank
  if (DICTIONARIES.en && DICTIONARIES.en[key]) {
    return DICTIONARIES.en[key];
  }
  return key;
}

export function updateDOM(lang: SupportedLanguage = getLanguage()) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = lang;

  const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const translated = t(key, lang);
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      (el as HTMLInputElement).placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });

  const placeholders = document.querySelectorAll<HTMLElement>("[data-i18n-placeholder]");
  placeholders.forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    (el as HTMLInputElement).placeholder = t(key, lang);
  });

    const titles = document.querySelectorAll<HTMLElement>("[data-i18n-title]");
  titles.forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (!key) return;
    el.setAttribute("title", t(key, lang));
  });

  const alts = document.querySelectorAll<HTMLElement>("[data-i18n-alt]");
  alts.forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (!key) return;
    el.setAttribute("alt", t(key, lang));
  });

    const contents = document.querySelectorAll<HTMLElement>("[data-i18n-content]");
  contents.forEach((el) => {
    const key = el.getAttribute("data-i18n-content");
    if (!key) return;
    el.setAttribute("content", t(key, lang));
  });

  // Update aria-labels
  const ariaLabels = document.querySelectorAll<HTMLElement>("[data-i18n-aria-label]");
  ariaLabels.forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (!key) return;
    el.setAttribute("aria-label", t(key, lang));
  });

  // Update switcher trigger labels and checkmarks
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const triggerLabels = document.querySelectorAll(".lang-switcher-current-label");
  triggerLabels.forEach((label) => {
    label.textContent = currentLangObj.name;
  });

  const checkmarks = document.querySelectorAll<HTMLElement>("[data-lang-check]");
  checkmarks.forEach((check) => {
    const code = check.getAttribute("data-lang-check");
    if (code === lang) {
      check.classList.remove("opacity-0");
      check.classList.add("opacity-100");
    } else {
      check.classList.remove("opacity-100");
      check.classList.add("opacity-0");
    }
  });
}

export function setLanguage(lang: SupportedLanguage) {
  if (!DICTIONARIES[lang]) return;
  currentLanguage = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}

  updateDOM(lang);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("instanttyping:languagechange", { detail: { language: lang } })
    );
  }
}

export function initI18n() {
  if (typeof window === "undefined") return;

  const initialLang = getLanguage();
  updateDOM(initialLang);

  document.addEventListener("astro:page-load", () => {
    updateDOM(getLanguage());
  });
}
