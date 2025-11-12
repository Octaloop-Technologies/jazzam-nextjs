"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { Dictionary } from "@/lib/i18n/getDictionary";

const Chasing = ({ dict }: { dict: Dictionary }) => {
  const [lang, setLang] = useState("en"); 

  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const currentImageRef = useRef<HTMLImageElement>(null);

  // Language ko detect karne ke liye effect
  useEffect(() => {
    const detectLanguage = () => {
      const match = document.cookie.match(/lang=([^;]+)/);
      if (match && match[1] !== lang) {
        setLang(match[1]);
      }
    };

    detectLanguage();
    
    // Cookie changes ko detect karne ke liye interval
    const interval = setInterval(detectLanguage, 100);
    
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    // ScrollTrigger setup
    const changeContent = (index: number) => {
      stepsRef.current.forEach((s, i) => {
        if (s) {
          gsap.to(s, {
            opacity: i === index ? 1 : 0.4,
            duration: 0,
            ease: "power2.out",
          });
        }
      });

      if (imageContainerRef.current && currentImageRef.current) {
        gsap.to(imageContainerRef.current, {
          opacity: 0,
          duration: 0,
          ease: "power2.in",
          onComplete: () => {
            if (currentImageRef.current) {
              currentImageRef.current.src = stepsData[index].image;
              gsap.to(imageContainerRef.current, {
                opacity: 1,
                duration: 0,
                ease: "power2.out",
              });
            }
          },
        });
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        scrub: 1,
        pin: true,
        trigger: "#pin-shopdesign",
        start: "top 10%",
        end: "bottom 90%",
      },
    });

    tl.to("#left-content", {
      opacity: 0.5,
      duration: 0.4,
      ease: "power2.out",
    }).to("#image-container", {
      opacity: 0.5,
      duration: 0.4,
      ease: "power2.out",
    });
    
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        if (!step) return;
        ScrollTrigger.create({
          trigger: step,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => changeContent(index),
          onEnterBack: () => changeContent(index),
        });
      });
    });

    changeContent(0);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [lang]); // lang ko dependency mein add kiya

  const stepsData = [
    {
      image: lang === 'en' ? "/assets/images/home/faisal_english.png" : "/assets/images/home/faisal_arabic.png",
      title: dict?.home.chasing.cardTitle1,
      description: dict?.home.chasing.cardPara1,
    },
    {
      image: "/assets/images/home/secondImg.svg",
      title: dict?.home.chasing.cardTitle2,
      description: dict?.home.chasing.cardPara2,
    },
    {
      image: "/assets/images/home/identify.svg",
      title: dict?.home.chasing.cardTitle3,
      description: dict?.home.chasing.cardPara3,
    },
  ];

  const steps = stepsData?.map((step, index) => (
    <div className="w-[90%] mx-auto md:w-full flex flex-col items-center" key={`step${index + 1}`}>
      <div className="w-full sm:w-80 md:w-96 bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <h3 className="text-[22px]! md:text-xl font-semibold text-center text-black mb-4">
          {step.title}
        </h3>
        <div className="flex justify-center mb-4">
          <Image src={step.image} width={231} height={216} alt="step image" />
        </div>
        <p className="text-lg text-center text-[#333]">{step.description}</p>
      </div>
    </div>
  ));

  return (
    <div className="relative">
      <div className="max-w-[1336px] mx-auto !py-[40px] !lg:py-[71px] flex flex-col gap-12 lg:gap-[121px] relative z-10">
        <div className="lg:grid grid-cols-2 gap-10 pt-32">
          <div className="relative col-span-1">
            <div id="image-container" className="sticky top-50">
              <div
                ref={imageContainerRef}
                className="w-full h-full relative rounded-lg overflow-hidden"
              >
                <div
                  className={`w-full max-w-[550px] lg:pr-20 pt-10 text-center ${
                    lang === "ar" ? "lg:text-right" : "lg:text-left"
                  } mb-10 lg:mb-0`}
                >
                  <h2 className="text-[36px] md:text-[52px] font-bold text-white leading-[110%] mb-4">
                    {dict?.home.chasing.title}
                  </h2>
                  <p className="text-[16px] md:text-[18px] text-normal leading-normal text-white">
                    {dict?.home.chasing.para}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="right-content" className="col-span-1 space-y-[50px] py-[100px]">
            {steps?.map((step, index) => (
              <React.Fragment key={index}>{step}</React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="toptop h-[300px] hidden md:block"></div>
      <div className="bg-grad opacity-70 w-full h-full absolute top-0 left-0">
        <img src="\assets\images\background.png" alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Chasing;