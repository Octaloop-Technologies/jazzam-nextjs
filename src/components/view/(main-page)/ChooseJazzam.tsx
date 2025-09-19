"use client";

import { useRef } from "react";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { FollowSvg, MeetingSvg, PredictionSvg } from "@/components/view/(main-page)/mainPageSvgs";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";
import { useButtonAnimation } from "@/styles/animations/useButtonAnimation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ChooseJazzam = ({ dict }: { dict: Dictionary }) => {
  const { titleRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.whyChooseJazzam?.title || "",
  });
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Use the reusable button animation hook
  useButtonAnimation({
    buttonRef,
    svgRef,
    enableScrollTrigger: true,
    enablePulsing: true,
    enableRipple: true,
    enableBackgroundFill: true,
    delay: 0.8, // Start after cards animation
    gradientColors: ["#FFD700", "#FFA500", "#FF8C00"],
  });

  // Stagger animation for cards
  useGSAP(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.children;

    // Set initial state for all cards
    gsap.set(cards, {
      opacity: 0,
      y: 60,
      scale: 0.9,
      rotationX: 15,
    });

    // Create stagger animation
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: {
        amount: 0.6, // Total time for all animations
        from: "start", // Start from the first card
      },
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse",
      },
    });

    // Add hover animation for individual cards
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
    <section className="home-padding bg-bg">
      <div className="home-wrapper text-center" ref={containerRef}>
        <h1 className="home-heading" ref={titleRef}>
          {dict?.home?.whyChooseJazzam?.title}
        </h1>

        <div
          ref={cardsRef}
          className="mt-11 grid grid-cols-3 gap-2.5 items-start max-xl:grid-cols-2 max-md:grid-cols-1"
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
              className={`bg-white h-full rounded-4xl-0 px-[72px] py-[60px] flex-col-center gap-14 max-3xl:gap-10 max-2xl:gap-5 max-sm:px-5 max-sm:py-5 
                  ${index === 2 ? "max-xl:col-span-2" : ""} 
                  ${index === 1 ? "max-md:col-span-2" : ""}`}
            >
              <h2 className="text-[18px] font-[600]">{item.title}</h2>
              <div className="size-[120px] max-2xl:size-[80px] max-sm:size-[60px]">{item.icon}</div>
              <p className="text-[14px] font-[500] text-[#333333]">{item.description}</p>
            </div>
          ))}
        </div>

        <button
          ref={buttonRef}
          className="mt-10 w-full relative max-w-[290px] h-[60px] bg-[#EEB600] text-white text-[16px] font-[600] rounded-4xl max-sm:h-[50px] max-sm:text-[14px]"
        >
          {dict?.home?.whyChooseJazzam?.registerYourCompany?.title}
          <svg
            ref={svgRef}
            className="absolute right-2 top-[40%] -translate-y-1/2"
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.58601 17.6852C9.43253 17.8389 9.22428 17.9253 9.00707 17.9255C8.78986 17.9257 8.58149 17.8395 8.42779 17.686C8.27409 17.5326 8.18765 17.3243 8.1875 17.1071C8.18735 16.8899 8.27349 16.6815 8.42697 16.5278L15.134 9.82237H10.6026C10.3855 9.82237 10.1773 9.73613 10.0238 9.58263C9.87034 9.42912 9.7841 9.22093 9.7841 9.00384C9.7841 8.78675 9.87034 8.57855 10.0238 8.42505C10.1773 8.27154 10.3855 8.1853 10.6026 8.1853H17.11C17.3271 8.1853 17.5353 8.27154 17.6888 8.42505C17.8423 8.57855 17.9285 8.78675 17.9285 9.00384V15.5112C17.9285 15.7283 17.8423 15.9365 17.6888 16.09C17.5353 16.2435 17.3271 16.3297 17.11 16.3297C16.8929 16.3297 16.6847 16.2435 16.5312 16.09C16.3777 15.9365 16.2915 15.7283 16.2915 15.5112V10.9798L9.58601 17.6852Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ChooseJazzam;
