"use client";
import Image from "next/image";
import React from "react";
import { Dictionary } from "@/lib/i18n/getDictionary";

const HowJazzamWork = ({ dict }: { dict: Dictionary }) => {
  const features = dict?.home?.jazzamWorks?.features;

  return (
    <div className="bg-bg">
      {/* Title */}
      <h1 className="text-[32px] sm:text-[40px] md:text-[52px] font-bold leading-[1.3] uppercase text-black text-center pt-[120px] md:pt-[180px] lg:pt-[235px]">
        {dict?.home?.jazzamWorks?.title}
      </h1>

      {/* Description */}
      <p className="text-[#777777] text-base sm:text-lg font-medium leading-[1.6] text-center pt-3 sm:pt-5 px-4 max-w-[700px] mx-auto">
        {dict?.home?.jazzamWorks?.description}
      </p>

      {/* Yellow Circles — Desktop Only */}
      <div className="relative justify-between mx-auto pt-12 max-w-[1300px] hidden lg:flex">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 hidden md:flex items-center justify-center w-[1132px] h-[120px]">
          <div className="absolute w-[300px] h-full flex flex-col justify-center items-center">
            <div className="w-[1280px] h-1 bg-[#EBEBEB] rounded-full relative mt-12">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
            </div>
          </div>
        </div>

        {/* Circles */}
        {[1, 2, 3, 4, 5]?.map((num) => (
          <div
            key={num}
            className="relative size-[60px] rounded-full bg-[#FFF] border-[6px] border-[#FFC300] p-[10px]"
          >
            <p className="absolute text-[#000] bottom-[8px] text-[24px] font-bold uppercase">
              {num.toString().padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      {/* Cards Section */}
      <div
        className="bg-no-repeat bg-cover bg-center h-auto z-50 mt-10 md:mt-0"
        style={{ backgroundImage: "url('/assets/images/home/bg-wave.svg')" }}
      >
        <div className="flex lg:flex-nowrap flex-wrap justify-center gap-5 pt-10 z-20 max-w-[1536px] mx-auto px-4">
          {features?.map((item, idx) => (
            <div
              key={idx}
              className="relative w-full sm:w-[45%] lg:w-auto rounded-[40px] bg-white/80 pt-[59px] pb-[75px] px-[33px] text-center"
              style={{ backgroundImage: "url('/assets/images/home/radiant.svg')" }}
            >
              {/* Circle for mobile */}
              <div className="lg:hidden absolute -top-7 left-1/2 -translate-x-1/2 size-[50px] rounded-full bg-[#FFF] border-[5px] border-[#FFC300] flex items-center justify-center">
                <p className="text-[#000] text-[20px] font-bold">
                  {(idx + 1).toString().padStart(2, "0")}
                </p>
              </div>

              <Image
                src={`/assets/icons/${
                  idx === 0
                    ? "leads.png"
                    : idx === 1
                    ? "behavior.png"
                    : idx === 2
                    ? "classify-leads.png"
                    : idx === 3
                    ? "action.png"
                    : "improve.png"
                }`}
                width={84}
                height={84}
                alt={item.title}
                className="mx-auto"
              />
              <p className="text-black font-bold leading-5 tracking-tighter pt-13.5 pb-3.5">
                {item.title}
              </p>
              <p className="text-[#333333] leading-5 font-medium text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes moveLineRtoL {
          0% {
            right: 0;
            transform: translateX(0%);
          }
          100% {
            right: 100%;
            transform: translateX(100%);
          }
        }
        .animate-moveLineRtoL {
          left: auto;
          right: 0;
          animation: moveLineRtoL 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HowJazzamWork;
