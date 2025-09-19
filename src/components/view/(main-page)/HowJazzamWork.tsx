"use client";

import OptimizedVideo from "@/components/ui/video/OptimizedVideo";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";

const HowJazzamWork = ({ dict }: { dict: Dictionary }) => {
  const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.hero?.title || "",
    paragraphText: dict?.home?.hero?.para || "",
  });

  return (
    <section className="home-padding">
      <div className="home-wrapper">
        <div className="flex items-center gap-12 max-3xl:flex-col max-3xl:gap-0" ref={containerRef}>
          <h1
            className="home-heading min-w-max max-4xl:min-w-auto max-xl:text-center"
            ref={titleRef}
          >
            {dict?.home?.seeHowJazzamWorks?.title}
          </h1>
          <p className="home-desc max-xl:text-center" ref={paragraphRef}>
            {dict?.home?.seeHowJazzamWorks?.description}
          </p>
        </div>
        <div className="mt-14 w-full h-[560px] p-[40px] relative max-3xl:h-auto max-lg:p-6">
          <div className="size-[320px] absolute top-0 left-0 gradient-bg-2 rounded-tl-4xl-0 max-lg:size-[200px] max-sm:size-[120px]" />
          <div className="size-[320px] absolute bottom-0 right-0 gradient-bg-2 rounded-br-4xl-0 max-lg:size-[200px] max-sm:size-[120px]" />

          <div className="w-full h-full relative rounded-4xl-0 overflow-hidden">
            <OptimizedVideo
              src="/assets/videos/home/how-it-works.mp4"
              controls={false}
              poster="/assets/images/home/dummy.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowJazzamWork;
