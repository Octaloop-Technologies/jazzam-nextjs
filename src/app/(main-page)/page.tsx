"use client";
import React, { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCurrentLang } from "@/lib/api/main-page";
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

const LandingPage = () => {
  const lang = getCurrentLang();
  const [language, setLanguage] = useState<any>();

  useEffect(() => {
    const handleLangauge = async() => {
      const dict = await getDictionary(lang);
      setLanguage(dict)
    };
    handleLangauge();
  }, [])

  return (
    <div>
      {/* ------------- hero ------------- */}
      <Hero dict={language} />

      {/* ------------- See How Jazzam Works ------------- */}
      <HowJazzamWork dict={language} />

      {/* -------------  BeforeJazzam  ------------- */}
      <Chasing dict={language} />

      {/* -------------  BeforeJazzam  ------------- */}
      <BeforeJazzam dict={language} />

      {/* ------------- Choose Jazzam ------------- */}
      <ChooseJazzam dict={language} />

      {/* ------------- Testimonials ------------- */}
      {/* <TestimonialsMarquee dict={language} /> */}

      {/* ------------- ProblemsJazzamSolves ------------- */}
      <ProblemsJazzamSolves dict={language} />

      {/* ------------- Letsstarttoday ------------- */}
      <Letsstarttoday dict={language} />

      {/* ------------- FAQs ------------- */}
      <Faqs dict={language} />

      {/* ------------- Contact us ------------- */}
      <ContactUs dict={language} />

      {/* show comming soon modal */}
      <ComingSoonModal dict={language} />
    </div>
  );
};

export default LandingPage;
