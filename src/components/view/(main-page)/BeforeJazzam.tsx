"use client";

import React from "react";
import Image from "next/image"; 

const BeforeJazzam: React.FC = () => {
  const items: string[] = [
    "INNOVATION",
    "DEVELOPMENT",
    "IMMERSION",
    "SCALABILITY",
    "VISUALIZATION",
    "INTELLIGENCE",
    "TRANSFORMATION",
  ];

  const duplicatedItems: string[] = [...items, ...items];

  const beforeItems: string[] = [
    "Manual lead tracking and data entry",
    "No way to prioritize leads effectively",
    "Lost opportunities from delayed follow-ups",
    "Wasted time on unqualified prospects",
  ];

  const withItems: string[] = [
    "Automated lead collection and analysis",
    "Smart lead scoring and prioritization",
    "Instant notifications for hot leads",
    "Focus only on qualified opportunities",
  ];

  const PLACEHOLDER_IMG: string =
    "https://placehold.co/128x200/064e3b/16a34a?text=Pattern";

  return (
    <section
      className="BeforeJazzam relative w-full pb-48 overflow-visible pt-10"
      style={{
        backgroundImage: "url('/assets/images/home/bg-wave.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Slider (Marquee) */}
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
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {duplicatedItems.map((item, index) => (
            <div
              key={index + duplicatedItems.length}
              className="flex items-center mx-4"
            >
              <span className="bg-green-600 text-white font-normal px-8 py-4 rounded-full text-[14px] leading-[100%] tracking-[2px] uppercase">
                {item}
              </span>
              <span className="text-yellow-400 text-2xl mx-4">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] mx-auto px-6 mt-16 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 hidden md:flex items-center justify-center w-[500px] h-[350px]">
          <div className="absolute w-[300px] h-full flex flex-col justify-center items-center">
            <div className="w-full h-1 bg-[#EBEBEB] rounded-full relative mb-12">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />
            </div>
            <div className="w-full h-1 bg-[#EBEBEB] rounded-full relative mt-12">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center relative z-10">
          {/* Before Jazzam Card */}
          <div className="bg-white w-full max-w-[532px] rounded-2xl shadow-xl p-8 order-1 z-10">
            <h3 className="text-[34px] font-semibold text-black leading-[21px] tracking-[2px] mb-6">
              Before Jazzam
            </h3>

            <div className="space-y-6">
              {beforeItems.map((text, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <path
                        d="M15.5844 14.1665H18.4178V21.2498H15.5844V14.1665ZM15.583 22.6665H18.4163V25.4998H15.583V22.6665Z"
                        fill="#FF0000"
                      />
                      <path
                        d="M19.5051 5.9503C19.0121 5.02238 18.0516 4.4458 17.0005 4.4458C15.9493 4.4458 14.9888 5.02238 14.4958 5.95172L4.10029 25.591C3.87016 26.0224 3.7562 26.5063 3.76962 26.9951C3.78303 27.4839 3.92335 27.9608 4.17679 28.379C4.42669 28.7992 4.78209 29.1469 5.20777 29.3874C5.63345 29.628 6.11461 29.7531 6.60354 29.7503H27.3974C28.4004 29.7503 29.3085 29.2375 29.8255 28.379C30.079 27.9608 30.2193 27.4839 30.2327 26.9951C30.2461 26.5063 30.1322 26.0224 29.902 25.591L19.5051 5.9503ZM6.60354 26.917L17.0005 7.27772L27.4045 26.917H6.60354Z"
                        fill="#FF0000"
                      />
                    </svg>
                  </div>
                  <p className="text-[#333] text-[16px] font-normal leading-relaxed tracking-[1px] pt-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* With Jazzam Card */}
          <div className="bg-white w-full max-w-[532px] rounded-2xl shadow-xl p-8 order-3 z-10">
            <h3 className="text-[34px] font-semibold text-black leading-[21px] tracking-[2px] mb-6">
              With Jazzam
            </h3>

            <div className="space-y-6">
              {withItems.map((text, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <path
                        d="M21.2501 14.167L15.5835 19.8337L12.7501 17.0004M18.7653 4.90061L20.4951 6.37394C20.9314 6.74511 21.4726 6.96894 22.0421 7.01569L24.3087 7.19702C24.953 7.24847 25.5579 7.52764 26.015 7.98452C26.4721 8.4414 26.7517 9.04613 26.8035 9.69036L26.9834 11.957C27.0301 12.5279 27.2554 13.0705 27.6266 13.5054L29.0999 15.2338C29.5198 15.7261 29.7504 16.3519 29.7504 16.9989C29.7504 17.646 29.5198 18.2718 29.0999 18.7641L27.6266 20.4939C27.2554 20.9302 27.0301 21.4714 26.9848 22.0423L26.8035 24.3089C26.752 24.9532 26.4729 25.5581 26.016 26.0152C25.5591 26.4724 24.9544 26.7519 24.3101 26.8037L22.0435 26.985C21.4728 27.0302 20.931 27.2543 20.4951 27.6254L18.7653 29.0987C18.273 29.5186 17.6472 29.7492 17.0001 29.7492C16.3531 29.7492 15.7273 29.5186 15.235 29.0987L13.5066 27.6254C13.0704 27.254 12.528 27.0299 11.9568 26.985L9.69014 26.8037C9.04569 26.7518 8.44078 26.4721 7.98387 26.0147C7.52696 25.5573 7.24793 24.952 7.19681 24.3075L7.01547 22.0423C6.96959 21.4719 6.74503 20.9306 6.37372 20.4953L4.90039 18.7641C4.48124 18.272 4.25104 17.6468 4.25104 17.0004C4.25104 16.354 4.48124 15.7287 4.90039 15.2366L6.37372 13.5054C6.74631 13.0691 6.96872 12.5279 7.01406 11.957L7.19539 9.69177C7.24697 9.04684 7.52674 8.44142 7.98449 7.98419C8.44224 7.52696 9.04799 7.24787 9.69297 7.19702L11.9568 7.01711C12.5276 6.97152 13.0695 6.74693 13.5052 6.37536L15.235 4.90202C15.7273 4.48212 16.3531 4.25146 17.0001 4.25146C17.6472 4.25146 18.273 4.48071 18.7653 4.90061Z"
                        stroke="#009DFF"
                        strokeWidth="2.83333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[#333] text-[16px] font-normal leading-relaxed tracking-[1px] pt-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 z-[100]  w-full max-w-[900px] ">
        <div className=" z-0 bg-gradient-to-r from-[#1BA64E] to-[#51C77C] rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute h-full z-0 top-0 -left-20 overflow-hidden ">
            <Image
              src={"/assets/icons/home/12.png"}
              alt="decorative left"
              width={599}
              height={600}
              unoptimized
              className="h-full w-[299px] z-0 object-cover rounded-[30px] ml-5 rotate-2"
            />
          </div>

          <div className="absolute right-[-40px] -top-40  w-[150px] h-[244px] overflow-hidden ">
            <Image
              src={"/assets/icons/home/beforeleft.png"}
              alt="decorative right"
              width={150}
              height={244}
              unoptimized
              className="h-full w-full  rounded-full"
            />
          </div>

          <div className="relative px-8 py-8 md:px-16 md:py-10">
            <h3 className="text-[#FFF] text-[34px] md:text-[24px] font-normal leading-[29px] text-center mb-6">
              Join The Waitlist Today!
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-3 z-50 max-w-[600px] mx-auto">
              <div className="flex-1 relative w-full">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4.875 3.75C3.97989 3.75 3.12145 4.10558 2.48851 4.73851C1.85558 5.37145 1.5 6.22989 1.5 7.125V16.875C1.5 17.7701 1.85558 18.6285 2.48851 19.2615C3.12145 19.8944 3.97989 20.25 4.875 20.25H19.125C20.0201 20.25 20.8785 19.8944 21.5115 19.2615C22.1444 18.6285 22.5 17.7701 22.5 16.875V7.125C22.5 6.22989 22.1444 5.37145 21.5115 4.73851C20.8785 4.10558 20.0201 3.75 19.125 3.75H4.875ZM21 7.80225L12 12.648L3 7.80225V7.125C3 6.62772 3.19754 6.15081 3.54917 5.79917C3.90081 5.44754 4.37772 5.25 4.875 5.25H19.125C19.6223 5.25 20.0992 5.44754 20.4508 5.79917C20.8025 6.15081 21 6.62772 21 7.125V7.80225ZM3 9.5055L11.6445 14.1608C11.7538 14.2196 11.8759 14.2504 12 14.2504C12.1241 14.2504 12.2462 14.2196 12.3555 14.1608L21 9.5055V16.875C21 17.3723 20.8025 17.8492 20.4508 18.2008C20.0992 18.5525 19.6223 18.75 19.125 18.75H4.875C4.37772 18.75 3.90081 18.5525 3.54917 18.2008C3.19754 17.8492 3 17.3723 3 16.875V9.5055Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-[14px] leading-normal text-[#999] focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-[#FFF]"
                />
              </div>
              <button className="w-full md:w-auto bg-[#EEB600]  font-semibold px-8 py-3 rounded-lg transition uppercase  tracking-wide whitespace-nowrap shadow-md text-[16px] tracking-normal text-[#FFF]">
                SEND NOW
              </button>
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

        @keyframes moveLineLtoR {
          0% {
            left: 0;
            transform: translateX(0%);
          }
          100% {
            left: 100%;
            transform: translateX(-100%);
          }
        }
        .animate-moveLineLtoR {
          animation: moveLineLtoR 3.5s linear infinite;
        }

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
          animation: moveLineRtoL 3.5s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default BeforeJazzam;
