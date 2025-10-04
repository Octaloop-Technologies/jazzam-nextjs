"use client";

import React from "react";

// Mock SVG (replace with actual SVG/image)
const MockCardSVG = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="w-24 h-40 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-green-100 flex items-center justify-center text-xs text-gray-600">
        Habib
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2/5 bg-green-600 flex items-center justify-center text-sm font-bold text-white">
        LEADS
      </div>
    </div>
  </div>
);

const Chasing = () => {
  return (
    <section className="min-h-screen p-8 md:p-16 flex items-start bg-gradient-to-b from-white via-[#c8e6c8] to-white">      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 lg:pr-20 pt-10 text-center lg:text-left mb-10 lg:mb-0">
          <h2 className="text-[36px] md:text-[52px] font-bold text-white leading-[110%] mb-4">
            PROBLEMS JAZZAM SOLVES
          </h2>
          <p className="text-[16px] md:text-[18px] text-normal leading-normal text-white">
            Transform your lead management challenges into opportunities
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full sm:w-80 md:w-96 bg-white p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-4">
              Chasing Disappearing Leads
            </h3>

            <div className="flex justify-center mb-4">
              <MockCardSVG />
            </div>

            <p className="text-sm text-center text-gray-600">
              No more lost opportunities from visitors who left without a trace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chasing;