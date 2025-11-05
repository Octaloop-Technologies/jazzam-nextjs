"use client";

import React, { useEffect, useState } from "react";
import Hero from "@/components/view/(main-page)/Hero";
import ChooseJazzam from "@/components/view/(main-page)/ChooseJazzam";
import HowJazzamWork from "@/components/view/(main-page)/HowJazzamWork";
import Faqs from "@/components/view/(main-page)/Faqs";
import ContactUs from "@/components/view/(main-page)/ContactUs";
import ProblemsJazzamSolves from "@/components/view/(main-page)/ProblemsJazzamSolves";
import Letsstarttoday from "@/components/view/(main-page)/Letsstarttoday";
import BeforeJazzam from "@/components/view/(main-page)/BeforeJazzam";
import Chasing from "@/components/view/(main-page)/Chassing";
import ComingSoonModal from "@/components/ui/models/CommingSoonModal";
import { useLocale } from "@/lib/hooks/useLocale";
import { Dictionary } from "@/lib/i18n/getDictionary";



const loaders: Record<string, () => Promise<Dictionary>> = {
  en: () => import("../../../dictionaries/en.json").then((m) => m.default),
  ar: () => import("../../../dictionaries/ar.json").then((m) => m.default),
};


const LandingPage = async () => {
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
    <div>
      {/* ------------- hero ------------- */}
      <Hero dict={dict} />

      {/* ------------- See How Jazzam Works ------------- */}
      <HowJazzamWork dict={dict} />

      {/* -------------  BeforeJazzam  ------------- */}
      <Chasing dict={dict} />

      {/* -------------  BeforeJazzam  ------------- */}
      <BeforeJazzam dict={dict} />

      {/* ------------- Choose Jazzam ------------- */}
      <ChooseJazzam dict={dict} />

      {/* ------------- Testimonials ------------- */}
      {/* <TestimonialsMarquee dict={dict} /> */}

      {/* ------------- ProblemsJazzamSolves ------------- */}
      <ProblemsJazzamSolves dict={dict} />

      {/* ------------- Letsstarttoday ------------- */}
      <Letsstarttoday dict={dict} />

      {/* ------------- FAQs ------------- */}
      <Faqs dict={dict} />

      {/* ------------- Contact us ------------- */}
      <ContactUs dict={dict} />

      {/* show comming soon modal */}
      <ComingSoonModal dict={dict} />
    </div>
  );
};

export default LandingPage;
