"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

// Define the dictionary structure based on the actual JSON files
type Dict = {
  [key: string]: string | number | Dict;
};

interface I18nContextValue {
  lang: string;
  dict: Dict;
  t: (key: string, fallback?: string) => string;
  setLocale: (code: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: string;
  dict: Dict;
  children: React.ReactNode;
}) {
  const [currentLang, setCurrentLang] = useState(lang);
  const [currentDict, setCurrentDict] = useState<Dict>(dict);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, fallback: string = key) => {
      const parts = key.split(".");
      let node: string | number | Dict = currentDict;
      for (const part of parts) {
        if (node && typeof node === "object" && part in node) {
          node = node[part];
        } else {
          return fallback;
        }
      }
      return typeof node === "string" ? node : fallback;
    };

    const loaders: Record<string, () => Promise<Dict>> = {
      en: () => import("../../dictionaries/en.json").then((m) => m.default),
      ar: () => import("../../dictionaries/ar.json").then((m) => m.default),
    };

    const setLocale = async (code: string) => {
      const loader = loaders[code] || loaders.en;
      const newDict = await loader();
      setCurrentLang(code);
      setCurrentDict(newDict);
    };

    return { lang: currentLang, dict: currentDict, t, setLocale };
  }, [currentLang, currentDict]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
