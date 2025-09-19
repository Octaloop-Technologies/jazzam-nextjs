"use client";

import { Dictionary } from "@/lib/i18n/getDictionary";
import WaitlistButton from "./WaitlistButton";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";

const Hero = ({ dict }: { dict: Dictionary }) => {
  const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.hero?.title || "",
    paragraphText: dict?.home?.hero?.para || "",
  });

  return (
    <section className="gradient-bg pb-14 pt-20">
      <div className="home-wrapper">
        <div ref={containerRef} className="text-white pb-10">
          <h1
            ref={titleRef}
            className="text-[60px] uppercase font-[700] max-lg:text-[40px] max-xs:text-[32px] leading-tight transform-gpu"
          >
            {dict?.home?.hero?.title}
          </h1>
          <p
            ref={paragraphRef}
            className="mt-4 text-[20px] capitalize font-[500] max-sm:text-[16px] transform-gpu"
          >
            {dict?.home?.hero?.para}
          </p>
        </div>

        <WaitlistButton />

        <div className="mt-10 w-full h-[560px] scale-110 relative max-2xl:scale-100 max-lg:h-[400px] max-md:h-[300px] max-xs:h-[200px]">
          <OptimizedImage
            src="/assets/images/home/hero.png"
            alt="hero-image"
            fill
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
