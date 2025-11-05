"use client";

import { useEffect } from "react";
import { useI18n } from "./I18nProvider";
import { useLocale } from "@/lib/hooks/useLocale";

export default function LocaleInitializer() {
  const { locale } = useLocale();
  const { setLocale } = useI18n();

  useEffect(() => {
    setLocale(locale).then(() => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      }
    });
  }, [locale, setLocale]);

  return null;
}