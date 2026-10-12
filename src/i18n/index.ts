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

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "en",
  "es",
  "ja",
  "fr",
  "de",
  "pt",
  "ko",
  "it",
];

export function isSupportedLanguage(lang: unknown): lang is SupportedLanguage {
  return typeof lang === "string" && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

const LOADERS: Record<SupportedLanguage, () => Promise<{ default: Record<string, string> }>> = {
  en: () => import("./en.json"),
  es: () => import("./es.json"),
  ja: () => import("./ja.json"),
  fr: () => import("./fr.json"),
  de: () => import("./de.json"),
  pt: () => import("./pt.json"),
  ko: () => import("./ko.json"),
  it: () => import("./it.json"),
};

export const DICTIONARIES: Partial<Record<SupportedLanguage, Record<string, string>>> = {};
const loadingPromises: Partial<Record<SupportedLanguage, Promise<Record<string, string>>>> = {};

export const STORAGE_KEY = "instanttyping_lang";
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

export function getLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isSupportedLanguage(saved)) {
        currentLanguage = saved;
      }
    } catch {}
  }
  return currentLanguage;
}

export function loadLanguage(lang: SupportedLanguage): Promise<Record<string, string>> {
  if (DICTIONARIES[lang]) {
    return Promise.resolve(DICTIONARIES[lang]!);
  }
  if (!loadingPromises[lang]) {
    const loader = LOADERS[lang] || LOADERS[DEFAULT_LANGUAGE];
    loadingPromises[lang] = loader()
      .then((mod) => {
        const dict = (mod && mod.default) || (mod as unknown as Record<string, string>);
        DICTIONARIES[lang] = dict;
        delete loadingPromises[lang];
        return dict;
      })
      .catch((err) => {
        delete loadingPromises[lang];
        console.error(`[i18n] Failed to load locale "${lang}":`, err);
        return {};
      });
  }
  return loadingPromises[lang]!;
}

// Kick off active language chunk fetch immediately when module loads
if (typeof window !== "undefined") {
  const initial = getLanguage();
  loadLanguage(initial);
}

export function t(
  key: string,
  langOrParams?: SupportedLanguage | Record<string, string | number>,
  maybeParams?: Record<string, string | number>
): string {
  let lang: SupportedLanguage;
  let params: Record<string, string | number> | undefined;

  if (typeof langOrParams === "string") {
    lang = langOrParams;
    params = maybeParams;
  } else {
    lang = getLanguage();
    params = langOrParams;
  }

  const dict = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANGUAGE];
  let text = (dict && dict[key]) ?? (DICTIONARIES.en && DICTIONARIES.en[key]) ?? key;

  if (params && typeof text === "string") {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }

  return text;
}

export function updateDOM(lang: SupportedLanguage = getLanguage()) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = lang;

  if (!DICTIONARIES[lang]) {
    loadLanguage(lang).then(() => {
      updateDOM(lang);
    });
    return;
  }

  document.documentElement.classList.remove("i18n-loading");

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

export async function setLanguage(lang: SupportedLanguage): Promise<void> {
  if (!isSupportedLanguage(lang)) return;
  currentLanguage = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}

  await loadLanguage(lang);
  updateDOM(lang);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("instanttyping:languagechange", { detail: { language: lang } })
    );
  }
}

export async function initI18n(): Promise<void> {
  if (typeof window === "undefined") return;

  const initialLang = getLanguage();
  await loadLanguage(initialLang);
  updateDOM(initialLang);

  document.addEventListener("astro:page-load", async () => {
    const lang = getLanguage();
    await loadLanguage(lang);
    updateDOM(lang);
  });
}
