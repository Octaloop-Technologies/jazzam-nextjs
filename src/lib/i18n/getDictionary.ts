"use server";

export async function getDictionary(locale: string) {
  // ==============================================================
  // Dictionaries configuration (Also Add in middleware.ts)
  // ==============================================================
  const dictionaries = {
    en: () => import("../../dictionaries/en.json").then((m) => m.default),
    ar: () => import("../../dictionaries/ar.json").then((m) => m.default),
  };

  return (dictionaries[locale as keyof typeof dictionaries] || dictionaries.en)();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
