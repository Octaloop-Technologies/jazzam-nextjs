"use client";

import React from "react";
import Image from "next/image";
import { Dictionary } from "@/lib/i18n/getDictionary";


const Letsstarttoday = ({ dict }: { dict: Dictionary }) => {



  const items = dict.home.beforeJazzam.marquee;

  const duplicatedItems: string[] = [...items, ...items];

  return (
    <section className=" Letsstarttoday  relative w-full bg-gradient-to-b from-[#fff] to-[#15803C66] pb-32 overflow-visible ">
      {/* Top slider */}
      <div className="w-full flex overflow-hidden relative py-8 -mt-8">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center mx-4">
              <span className="bg-green-600 text-white font-normal px-8 py-4 rounded-full text-[14px] leading-[100%] tracking-[2px] uppercase">
                {item}
              </span>
              <span className="text-yellow-400 text-2xl mx-4">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Content */}
      <div className="w-full max-w-[800px] mx-auto text-center pt-[50px] sm:pt-[123px] mb-16 px-4">
        <h2 className="home-heading  text-[52px]! !text-[#fff] ">
          {dict?.home?.letsstarttoday?.title}
        </h2>
        <p className="home-desc max-w-[500px] mx-auto !text-[#fff]">
          {dict?.home?.letsstarttoday?.description}
        </p>

        {/* Button */}
        <div className="flex justify-center mt-6">
          {/* Button text */}
          <button className="text-[#FFF]  bg-[#EEB600]  font-semibold px-8 py-4 rounded-lg uppercase text-sm tracking-wide">
            {dict?.home?.letsstarttoday?.button}
          </button>

          {/* Arrow part */}
          <div className="bg-[#EEB600] px-4 flex cursor-pointer items-center justify-center rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="none"
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


        <p className="text-[16px] leading-[26px] text-[#fff] font-normal mt-4">
          {dict?.home?.letsstarttoday?.para}
        </p>
      </div>

      {/* Bottom Card - Positioned to overlap with next section */}
      <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-[900px] h-[214px] px-4 ">
        <div className="bg-white rounded-3xl shadow-lg relative overflow-hidden">
          {/* Left decorative image */}
          <div className="absolute top-[-25px] left-[-12px] bottom-[-20px] w-40 h-40 overflow-hidden">
            <Image
              src="/assets/icons/home/wavetop.png"
              alt="decorative"
              fill
              className="object-contain"
            />
          </div>


          {/* Right decorative image */}
          <div className="bottomimage absolute right-0 bottom-0 w-32 overflow-hidden rounded-3xl">
            <Image
              src="/assets/icons/home/wavebottom.png"
              alt="decorative"
              width={233}
              height={244}
              className="h-full w-full object-cover"
            />
          </div>


          {/* Card content */}
          <div className="relative  px-32 py-12 max-md:px-8">

            <div className="text-center mb-6">
              <h3 className="text-[20px] font-bold text-[#000] leading-[108%] tracking-[1px] mb-[6px]">
                {dict?.home?.letsstarttoday?.cardtitle}
              </h3>
              <p className="text-[#333] font-normal text-[14px] leading-[155%] tracking-[0.5%]">
                {dict?.home?.letsstarttoday?.cardpara}
              </p>
            </div>


            <div className="flex items-center justify-center gap-36 max-md:gap-8   max-md:flex-wrap">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 hidden md:flex items-center justify-center w-[500px] h-[350px]">
                <div className="absolute w-[410px] h-full flex flex-col gap-3 justify-center items-center mt-19">
                  <div className="w-full z-0 h-1 bg-[#EBEBEB] rounded-full relative mb-3">
                    <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />
                    <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />

                  </div>
                  <div className="w-full h-1 bg-[#EBEBEB] rounded-full relative mt-3 ">
                    <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
                    <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />

                  </div>
                </div>
              </div>


              {/* Active Users */}
              <div className="text-center z-50 bg-white">
                <div className="text-[44px]  font-normal text-[#000] leading-[113%] mb-2">500+</div>
                <div className="text-[14px] leading-[100%] font-normal text-[#444]">{dict?.home?.letsstarttoday?.number1}</div>
              </div>

              {/* Satisfaction */}
              <div className="text-center z-50 bg-white">
                <div className="text-[44px] font-normal text-[#000] leading-[113%] mb-2">98%</div>
                <div className="text-[14px] leading-[100%] font-normal text-[#444]">{dict?.home?.letsstarttoday?.number2}</div>
              </div>

              {/* Support */}
              <div className="text-center z-50 bg-white">
                <div className="text-[44px] font-normal text-[#000] leading-[113%] mb-2">24/7</div>
                <div className="text-[14px] leading-[100%] font-normal text-[#444]">{dict?.home?.letsstarttoday?.number3}</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-reverse {
          display: inline-flex;
          animation: marquee-reverse 8s linear infinite;
        }
      `}</style>


    </section >
  );
};

export default Letsstarttoday;