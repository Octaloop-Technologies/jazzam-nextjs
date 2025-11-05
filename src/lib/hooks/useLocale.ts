"use client";
import { useState, useEffect } from 'react';

const supportedLocales = ['en', 'ar'];
const defaultLocale = 'en';

export const useLocale = () => {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    // Check if locale is already stored
    const storedLocale = localStorage.getItem('lang');
    if (storedLocale && supportedLocales.includes(storedLocale)) {
      setLocale(storedLocale);
      return;
    }

    // Detect from browser
    const browserLang = navigator.language.split('-')[0];
    const detectedLocale = supportedLocales.includes(browserLang) 
      ? browserLang 
      : defaultLocale;

    setLocale(detectedLocale);
    localStorage.setItem('lang', detectedLocale);
  }, []);

  const setLocaleWithStorage = (newLocale: string) => {
    if (supportedLocales.includes(newLocale)) {
      setLocale(newLocale);
      localStorage.setItem('lang', newLocale);
    }
  };

  return { locale, setLocale: setLocaleWithStorage };
};