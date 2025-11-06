import React from "react";
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

const LandingPage = async () => {
  const lang = await getCurrentLang();
  const dict = await getDictionary(lang);

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
