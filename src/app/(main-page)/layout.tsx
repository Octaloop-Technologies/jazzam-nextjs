"use client";

import { useEffect, useState } from "react";
import HomeNavbar from "./HomeNavbar";
import HomeFooter from "./HomeFooter";
import { useLocale } from "@/lib/hooks/useLocale";
import { Dictionary } from "@/lib/i18n/getDictionary";

const loaders: Record<string, () => Promise<Dictionary>> = {
  en: () => import("../../../dictionaries/en.json").then((m) => m.default),
  ar: () => import("../../../dictionaries/ar.json").then((m) => m.default),
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useLocale();
  const [dict, setDict] = useState<Dictionary | null>(null);


  useEffect(() => {
    const load = async () => {
      const loadDict = loaders[locale] || loaders.en;
      const d = await loadDict();
      setDict(d);
      if (typeof document !== "undefined") {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      }
    };
    load();
  }, [locale]);

  if (!dict) return null;

  return (
    <div className="w-full bg-white min-h-dvh flex flex-col">
      <HomeNavbar dict={dict} currentLang={locale} />
      <main className="flex-1">{children}</main>
      <HomeFooter dict={dict} />
    </div>
  );
};

export default HomeLayout;
