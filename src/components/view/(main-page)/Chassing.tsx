"use client";

import Image from "next/image";
import React from "react";


import { Dictionary } from "@/lib/i18n/getDictionary";
const Chasing = ({ dict }: { dict: Dictionary }) => {
  return (
    <section className="min-h-screen p-8 md:p-16 flex items-start bg-gradient-to-b from-white via-[#c8e6c8] to-white">      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 lg:pr-20 pt-10 text-center lg:text-left mb-10 lg:mb-0">
          <h2 className="text-[36px] md:text-[52px] font-bold text-white leading-[110%] mb-4">
           {dict.home.chasing.title}
          </h2>
          <p className="text-[16px] md:text-[18px] text-normal leading-normal text-white">
            {dict.home.chasing.para}
          </p>
        </div>

        {/* Right Side */}
<div className="flex-col space-y-2 lg:w-1/2 h-[480px] overflow-y-auto">
        <div className="w-full  flex flex-col items-center">
          <div className="w-full sm:w-80 md:w-96 bg-white p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-4">
              {dict.home.chasing.cardTitle1}
            </h3>

            <div className="flex justify-center mb-4">
             <Image src="/assets/images/home/habib2.png" width={231} height={216} alt="habib"/>
            </div>

            <p className="text-sm text-center text-gray-600">
              {dict.home.chasing.cardPara1}
            </p>
          </div>
        </div>
          <div className="w-full flex flex-col items-center">
          <div className="w-full sm:w-80 md:w-96 bg-white p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-4">
              {dict.home.chasing.cardTitle2}
            </h3>

            <div className="flex justify-center mb-4">
             <Image src="/assets/images/home/secondImg.svg" width={231} height={216} alt="habib"/>
            </div>

            <p className="text-sm text-center text-gray-600">
             {dict.home.chasing.cardPara2}

            </p>
          </div>
           </div>
             <div className="w-full flex flex-col items-center">
           <div className="w-full sm:w-80 md:w-96 bg-white p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-4">
              {dict.home.chasing.cardTitle3}
            </h3>

            <div className="flex justify-center mb-4">
             <Image src="/assets/images/home/identify.svg" width={231} height={216} alt="habib"/>
            </div>

            <p className="text-sm text-center text-gray-600">
            {dict.home.chasing.cardPara3}

            </p>
          </div>
       </div>
      </div>
      </div>
    </section>
  );
};

export default Chasing;