import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";

export type Lang = "en" | "bn";

const STORAGE_KEY = "driftguard:lang";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Pick the string for the active language. */
  bi: (en: string, bn: string) => string;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  bi: (en) => en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "bn" || stored === "en") setLangState(stored);
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(() => ({
    lang,
    setLang: (next) => {
      setLangState(next);
      try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* storage unavailable */ }
    },
    bi: (en, bn) => (lang === "bn" ? bn : en),
  }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function LanguageToggle() {
  const { lang, setLang, bi } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "bn" : "en")}
      title={bi("Switch to Bangla", "Switch to English")}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "en" ? "বাংলা" : "English"}
    </button>
  );
}
