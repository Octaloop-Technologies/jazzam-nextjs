"use client";

import React from "react";
import Image from "next/image";
import { Dictionary } from "@/lib/i18n/getDictionary";
const ProblemsJazzamSolves: React.FC<{ dict: Dictionary }> = ({ dict }) => {
  return (
    <section
      className=" ProblemsJazzamSolves relative py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/home/bg-wave.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full px-6 flex flex-col lg:flex-row  gap-10 max-w-[1536px] mx-auto">
        {/* LEFT SIDE CONTENT */}
        <div className="flex-1 max-w-[650px] z-20">
          <h2 className="home-heading">{dict.home.problemSolved.Title}</h2>
          <p className="text-[#777777] text-lg! font-medium mb-7 ">
            {dict.home.problemSolved.para}
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 z-0 gap-[5px] max-md:grid-cols-1 ">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-[34px] w-full p-6 flex flex-col gap-3
            md:max-w-[320px]">
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">{dict.home.problemSolved.cardpara1}</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
               {dict.home.problemSolved.cardTitle1}.
              </p>
               <Image
                src="/assets/icons/home/problemicon1.png"
                alt="Qualified Leads"
                width={64}
                height={64}
              />
            </div>

            {/* Card 2 */}
            <div className="bg-white w-full shadow-lg rounded-[34px] p-6 flex flex-col gap-3 md:max-w-[320px]">
             
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">{dict.home.problemSolved.cardpara2}</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
              {dict.home.problemSolved.cardTitle2}.
              </p>
               <Image
                src="/assets/icons/home/problemicon2.png"
                alt="Save Team Time"
                width={64}
                height={64}
              />
            </div>

            {/* Card 3 */}
            <div className="bg-white w-full shadow-lg rounded-[34px] p-6 flex flex-col gap-3 md:max-w-[320px]">
              
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">{dict.home.problemSolved.cardpara3}</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
               {dict.home.problemSolved.cardTitle3}.
              </p>
              <Image
                src="/assets/icons/home/problemicon3.png"
                alt="Smarter Decisions"
                width={64}
                height={64}
              />
            </div>

            {/* Card 4 */}
            <div className="bg-white shadow-lg w-full rounded-[34px] p-6 flex flex-col gap-3 md:max-w-[320px]">
              
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">{dict.home.problemSolved.cardpara4}</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
              {dict.home.problemSolved.cardTitle4}.
              </p>
              <Image
                src="/assets/icons/home/problemicon4.png"
                alt="Faster Sales"
                width={64}
                height={64}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LAPTOP IMAGE */}
       <div
    className="flex-1 bg-no-repeat bg-right bg-cover z-50  w-full"
    style={{ backgroundImage: "url('/assets/images/home/laptop.svg')" }}
  />

      </div>

      {/* Bottom Shadow Effect */}
      <div className="absolute bottom-0 z-50 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 to-transparent " />
    </section>
  );
};

export default ProblemsJazzamSolves;
