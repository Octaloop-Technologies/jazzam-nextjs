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
    <section className="relative w-full bg-gradient-to-b from-[#e8f5e8] to-[#d2f1d2] pb-16 overflow-hidden">
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
      <div className="w-full max-w-[800px] mx-auto text-center mt-8 mb-16 px-4">
        <h2 className="text-5xl font-bold text-gray-800 mb-4 tracking-wider">
          LET&apos;S START TODAY
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Join hundreds of businesses already using Jazzam to<br />
          qualify their leads
        </p>

        {/* Button */}
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-md flex items-center mx-auto gap-3 transition uppercase text-sm tracking-wide">
          REGISTER YOUR COMPANY
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="text-sm text-gray-500 mt-4">
          No credit card required • 14-day free trial
        </p>
      </div>

      {/* Bottom Card */}
      <div className="w-full max-w-[900px] mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg relative overflow-hidden">
          {/* Left decorative image */}
          <div className="absolute left-0 top-0 bottom-0 w-32 overflow-hidden">
            <Image
              src="/assets/icons/home/problem1"
              alt="decorative"
              width={128}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right decorative image */}
          <div className="absolute right-0 top-0 bottom-0 w-32 overflow-hidden">
            <Image
              src="/assets/icons/home/wavetop.svg"
              alt="decorative"
              width={128}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Card content */}
          <div className="relative px-32 py-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Join Industry Leaders
              </h3>
              <p className="text-gray-600">
                Trusted by companies across Saudi Arabia
              </p>
            </div>

            <div className="flex items-center justify-center gap-16">
              {/* Active Users */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  500+
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>

              {/* Satisfaction */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  98%
                </div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>

              {/* Support */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  24/7
                </div>
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