"use client";

import React from "react";
import Image from "next/image";

const Letsstarttoday: React.FC = () => {
  const items = [
    "INNOVATION",
    "DEVELOPMENT",
    "IMMERSION",
    "SCALABILITY",
    "VISUALIZATION",
    "INTELLIGENCE",
    "TRANSFORMATION",
  ];

  const duplicatedItems = [...items, ...items];

  return (
    <section className=" Letsstarttoday  relative w-full bg-gradient-to-b from-[#fff] to-[#15803C66] pb-32 overflow-visible">
      {/* Top slider */}
      <div className="w-full flex overflow-hidden relative py-8">
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
      <div className="w-full max-w-[800px] mx-auto text-center pt-[123px] mb-16 px-4">
        <h2 className="home-heading !text-[#fff]">
          LET&apos;S START TODAY
        </h2>
        <p className="home-desc !text-[#fff]">
          Join hundreds of businesses already using Jazzam to qualify their leads
        </p>

        {/* Button */}
        <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-md flex items-center mx-auto gap-3 transition uppercase text-sm tracking-wide">
          REGISTER YOUR COMPANY
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="text-[16px] leading-[26px] text-[#fff] font-normal mt-4">
          No credit card required • 14-day free trial
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
    <div className="relative px-32 py-12 max-md:px-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Join Industry Leaders
        </h3>
        <p className="text-gray-600">
          Trusted by companies across Saudi Arabia
        </p>
      </div>

      <div className="flex items-center justify-center gap-16 max-md:gap-8 max-md:flex-wrap">
        {/* Active Users */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>

        {/* Satisfaction */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>

        {/* Support */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
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
    </section>
  );
};

export default Letsstarttoday;