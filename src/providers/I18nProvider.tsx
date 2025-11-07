"use client";

import React, { createContext, useContext, useMemo, useState } from "react";


// Static imports of dictionaries
import enDict from "@/dictionaries/en.json";
import arDict from "@/dictionaries/ar.json";

// Define the dictionary structure based on the actual JSON files
type DictValue = string | number | Dict | DictArray;
type DictArray = Array<string | number | { [key: string]: string | number }>;
type Dict = {
  [key: string]: DictValue;
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
      let node: DictValue = currentDict;
      for (const part of parts) {
        if (node && typeof node === "object" && !Array.isArray(node) && part in node) {
          node = node[part];
        } else {
          return fallback;
        }
      }
      return typeof node === "string" ? node : fallback;
    };

    // const loaders: Record<string, () => Promise<Dict>> = {
    //   en: () => import("../../dictionaries/en.json").then((m) => m.default),
    //   ar: () => import("../../dictionaries/ar.json").then((m) => m.default),
    // };
    // const loaders: Record<string, () => Promise<Dict>> = {
    //   en: () => import("../../../dictionaries/en.json").then((m) => m.default),
    //   ar: () => import("../../../dictionaries/ar.json").then((m) => m.default),
    // };

    const setLocale = async (code: string) => {
      // Use pre-imported dictionaries instead of dynamic imports
      const dictMap: Record<string, Dict> = {
        en: enDict,
        ar: arDict,
      };
      
      const newDict = dictMap[code] || dictMap.en;
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
