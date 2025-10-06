"use client";

import { useRef, useEffect } from "react";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { FollowSvg, MeetingSvg, PredictionSvg } from "@/components/view/(main-page)/mainPageSvgs";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";
import { useButtonAnimation } from "@/styles/animations/useButtonAnimation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ChooseJazzam = ({ dict }: { dict: Dictionary }) => {
  const { titleRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.whyChooseJazzam?.title || "",
  });
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useButtonAnimation({
    buttonRef,
    svgRef,
    enableScrollTrigger: true,
    enablePulsing: true,
    enableRipple: true,
    enableBackgroundFill: true,
    delay: 0.8,
    gradientColors: ["#FFD700", "#FFA500", "#FF8C00"],
  });

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;

    gsap.set(cards, {
      opacity: 0,
      y: 60,
      scale: 0.9,
      rotationX: 15,
    });

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: {
        amount: 0.6,
        from: "start",
      },
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse",
      },
    });

    Array.from(cards).forEach((card: Element) => {
      const cardElement = card as HTMLElement;
      cardElement.addEventListener("mouseenter", () => {
        gsap.to(cardElement, {
          scale: 1.01,
          y: -10,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      cardElement.addEventListener("mouseleave", () => {
        gsap.to(cardElement, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }, []);

  return (
    <section className="home-padding bg-[#15803C14]">
      <div className="home-wrapper text-center" ref={containerRef}>
        <h1 className="home-heading pt-[120px]" ref={titleRef}>
          {dict?.home?.whyChooseJazzam?.title}
        </h1>

        {/* cards */}
        <div
          ref={cardsRef}
          className="mt-11 grid grid-cols-3 gap-2.5 items-start 
            max-xl:grid-cols-2 max-md:grid-cols-1"
        >
          {[
            {
              title: dict?.home?.whyChooseJazzam?.smartCustomerFollowUp?.title,
              icon: <FollowSvg />,
              description: dict?.home?.whyChooseJazzam?.smartCustomerFollowUp?.description,
            },
            {
              title: dict?.home?.whyChooseJazzam?.automaticMeetingScheduling?.title,
              icon: <MeetingSvg />,
              description: dict?.home?.whyChooseJazzam?.automaticMeetingScheduling?.description,
            },
            {
              title: dict?.home?.whyChooseJazzam?.accurateSalesPredictions?.title,
              icon: <PredictionSvg />,
              description: dict?.home?.whyChooseJazzam?.accurateSalesPredictions?.description,
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`bg-white h-full rounded-4xl-0 px-[72px] py-[60px] flex-col-center gap-14
                max-3xl:gap-10 max-2xl:gap-5 max-lg:px-10 max-lg:py-8 
                max-sm:px-5 max-sm:py-5
                ${index === 2 ? "max-xl:col-span-2" : ""} 
                ${index === 1 ? "max-md:col-span-2" : ""}`}
            >
              <div className=" mx-auto">
                {item.icon}
              </div>
              <p className="text-[14px] font-[500] text-[#333333]">{item.description}</p>
            </div>
          ))}
        </div>

        {/* stats */}
        <div
          className="relative flex flex-row justify-between items-center mx-[60px] py-[54px] z-0
          max-lg:mx-[20px] max-md:flex-wrap max-md:justify-center max-md:gap-8 max-sm:mx-2 max-sm:py-6"
        >


      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0  hidden md:flex items-center justify-center w-full h-[350px] ">
          <div className="absolute w-full h-full  flex flex-col gap-3 justify-center items-center my-5">
            <div className="w-full  h-1 bg-white rounded-full relative mb-4">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />
            </div>
            <div className="w-full h-1 bg-white rounded-full relative mt-4 ">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
             <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />

            </div>
          </div>
        </div>


          <div className="backdrop-blur-md z-50 flex flex-col justify-center text-center">
            <h1 className="text-black font-medium text-[60px] max-lg:text-[48px] max-md:text-[40px] max-sm:text-[32px] ">
              85%
            </h1>
            <p className="text-[#444] text-[14px] max-sm:text-[12px]">Lead Quality Improvement</p>
          </div>

          <div className="backdrop-blur-md  z-50 flex flex-col justify-center text-center">
            <h1 className="text-black font-medium text-[60px] max-lg:text-[48px] max-md:text-[40px] max-sm:text-[32px] ">
              60%
            </h1>
            <p className="text-[#444] text-[14px] max-sm:text-[12px]">Time Saved Daily</p>
          </div>

          <div className="backdrop-blur-md  z-50 flex flex-col justify-center text-center">
            <h1 className="text-black font-medium text-[60px] max-lg:text-[48px] max-md:text-[40px] max-sm:text-[32px] ">
              3X
            </h1>
            <p className="text-[#444] text-[14px] max-sm:text-[12px]">Faster Conversions</p>
          </div>

          <div className="backdrop-blur-md  z-50 flex flex-col justify-center text-center">
            <h1 className="text-black font-medium text-[60px] max-lg:text-[48px] max-md:text-[40px] max-sm:text-[32px] ">
              16k
            </h1>
            <p className="text-[#444] text-[14px] max-sm:text-[12px]">Happy Customers</p>
          </div>
        </div>

        {/* button */}
        
         <div className="flex  justify-center mt-6">
  <button className="text-[#FFF]  bg-[#EEB600]  font-semibold px-8 py-4 rounded-lg uppercase text-sm tracking-wide shadow-[0_18px_16px_0_rgba(238,182,0,0.4)]">
    REGISTER YOUR COMPANY
  </button>

 <div className="group bg-[#EEB600] px-4 cursor-pointer flex items-center justify-center rounded-lg shadow-[0_18px_16px_0_rgba(238,182,0,0.4)]">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    viewBox="0 0 24 24"
    fill="none"
    className="transition-transform duration-300 group-hover:rotate-45"
  >
    <path
      d="M10 17L17 10M17 10V17M17 10H10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>

</div>

      </div>

      
    </section>
  );
};

export default ChooseJazzam;
