"use client";

import React from "react";
import Image from "next/image";

const ProblemsJazzamSolves: React.FC = () => {
  return (
    <section
      className=" ProblemsJazzamSolves relative py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/home/bg-wave.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full px-6 flex flex-col lg:flex-row items-center gap-10 max-w-[1400px] mx-auto">
        {/* LEFT SIDE CONTENT */}
        <div className="flex-1 max-w-[650px] z-20">
          <h2 className="home-heading">PROBLEMS JAZZAM SOLVES</h2>
          <p className="text-[#777777] text-lg! font-medium mb-7 ">
            Transform your lead management challenges into opportunities
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-3
            max-w-[320px]">
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">More Qualified Leads</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
                Focus only on prospects with genuine buying intent.
              </p>
               <Image
                src="/assets/icons/home/problemicon1.png"
                alt="Qualified Leads"
                width={64}
                height={64}
              />
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-3">
             
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">Save Team Time</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
                Reduce manual work and increase productivity.
              </p>
               <Image
                src="/assets/icons/home/problemicon2.png"
                alt="Save Team Time"
                width={64}
                height={64}
              />
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-3">
              
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">Smarter Decisions</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
                Data-driven insights for better conversion rates.
              </p>
              <Image
                src="/assets/icons/home/problemicon3.png"
                alt="Smarter Decisions"
                width={64}
                height={64}
              />
            </div>

            {/* Card 4 */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-3">
              
              <h3 className="font-bold text-black text-[16px] leading-[21px] tracking-[0.64px]">Faster Sales</h3>
              <p className="text-[14px] font-normal text-[#333] leading-[21px] tracking-[0.56px] ">
                Accelerate your sales cycle with prioritized leads.
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
        <div className="flex-1 relative flex justify-center">
          <Image
            src="/assets/images/home/laptop.svg" 
            alt="Jazzam Dashboard"
            width={1534}
            height={732}
            className="absolute z-10 w-full h-auto max-w-[700px] bottom-[-352px] left-[-120px]"
          />
        </div>
      </div>

      {/* Bottom Shadow Effect */}
      <div className="absolute bottom-0 z-50 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 to-transparent " />
    </section>
  );
};

export default ProblemsJazzamSolves;
