// "use client";

// import OptimizedVideo from "@/components/ui/video/OptimizedVideo";
// import { Dictionary } from "@/lib/i18n/getDictionary";
// import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";

// const HowJazzamWork = ({ dict }: { dict: Dictionary }) => {
//   const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
//     titleText: dict?.home?.hero?.title || "",
//     paragraphText: dict?.home?.hero?.para || "",
//   });

//   return (
//     <section className="home-padding">
//       <div className="home-wrapper">
//         <div className="flex items-center gap-12 max-3xl:flex-col max-3xl:gap-0" ref={containerRef}>
//           <h1
//             className="home-heading min-w-max max-4xl:min-w-auto max-xl:text-center"
//             ref={titleRef}
//           >
//             {dict?.home?.seeHowJazzamWorks?.title}
//           </h1>
//           <p className="home-desc max-xl:text-center" ref={paragraphRef}>
//             {dict?.home?.seeHowJazzamWorks?.description}
//           </p>
//         </div>
//         <div className="mt-14 w-full h-[560px] p-[40px] relative max-3xl:h-auto max-lg:p-6">
//           <div className="size-[320px] absolute top-0 left-0 gradient-bg-2 rounded-tl-4xl-0 max-lg:size-[200px] max-sm:size-[120px]" />
//           <div className="size-[320px] absolute bottom-0 right-0 gradient-bg-2 rounded-br-4xl-0 max-lg:size-[200px] max-sm:size-[120px]" />

//           <div className="w-full h-full relative rounded-4xl-0 overflow-hidden">
//             <OptimizedVideo
//               src="/assets/videos/home/how-it-works.mp4"
//               controls={false}
//               poster="/assets/images/home/dummy.png"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowJazzamWork;



"use client";
import Image from 'next/image';
import React from 'react'

const HowJazzamWork = () => {
  const features = [
  {
    icon: "/assets/icons/leads.png",
    title: "Collect Leads",
    desc: "Gathers leads from your website, LinkedIn, & Snapchat.",
  },
  {
    icon: "/assets/icons/behavior.png",
    title: "Analyze Behavior",
    desc: "Studies visitor behavior to measure genuine interest and intent.",
  },
  {
    icon: "/assets/icons/classify-leads.png",
    title: "Classify Leads",
    desc: "Categorizes leads as Hot, Warm, or Cold based on engagement.",
  },
  {
    icon: "/assets/icons/action.png",
    title: "Recommend Actions",
    desc: "Suggests next steps call immediately, follow-up, or archive.",
  },
  {
    icon: "/assets/icons/improve.png",
    title: "Learn & Improve",
    desc: "Continuously learns from your feedback for smarter results.",
  },
];
  return (
    <div className='bg-bg '>
      <h1 className='text-[52px]!  font-bold leading-13 uppercase text-black text-center pt-[235px]'>How Jazzam Works</h1>
      <p className='text-[#777777] text-lg! font-medium leading-6.5 text-center pt-5'>Simple, powerful, and intelligent lead qualification</p>
      <div className='relative flex justify-between mx-auto pt-12 max-w-[1300px]'>

         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 hidden md:flex items-center justify-center w-[1132px] h-[120px]">
          <div className="absolute w-[300px] h-full flex flex-col justify-center items-center">
            {/* <div className="w-full h-1 bg-[#EBEBEB] rounded-full relative mb-12">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineLtoR" />
            </div> */}
            <div className="w-[1280px] h-1 bg-[#EBEBEB] rounded-full relative mt-12">
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />
              <div className="absolute top-0 h-1 w-5 bg-green-500 rounded-full animate-moveLineRtoL" />

            </div>
          </div>
        </div>


      <div className='relative !size-[60px] border rounded-full bg-[#FFF] border-[6px] border-[#FFC300] p-[12px]'>
        <p className=' absolute text-[#000] bottom-[4px] text-[24px] font-bold upercase'>
          01
        </p>
      </div>

      <div className='relative !size-[60px] border rounded-full bg-[#FFF] border-[6px] border-[#FFC300] p-[12px]'>
        <p className=' absolute text-[#000] bottom-[4px] text-[24px] font-bold upercase'>
          02
        </p>
      </div>

      <div className='relative !size-[60px] border rounded-full bg-[#FFF] border-[6px] border-[#FFC300] p-[12px]'>
        <p className=' absolute text-[#000] bottom-[4px] text-[24px] font-bold upercase'>
          03
        </p>
      </div>

      <div className='relative !size-[60px] border rounded-full bg-[#FFF] border-[6px] border-[#FFC300] p-[12px]'>
        <p className=' absolute text-[#000] bottom-[4px] text-[24px] font-bold upercase'>
          04
        </p>
      </div>

      <div className='relative !size-[60px] border rounded-full bg-[#FFF] border-[6px] border-[#FFC300] p-[12px]'>
        <p className=' absolute text-[#000] bottom-[4px] text-[24px] font-bold upercase'>
          05
        </p>
      </div>


        {/* <Image src="/assets/images/home/steps.svg" width={1132} height={60} alt='steps'/> */}
      </div>


 <div className="bg-no-repeat bg-cover bg-center h-[422px] z-50" style={{ backgroundImage: "url('/assets/images/home/bg-wave.svg')" }} >
 <div className='flex gap-5 pt-10 z-20 max-w-[1536px] mx-auto px-2 '>
      {features.map((item, idx) => (
        <div
          key={idx}
          className="rounded-[40px]  bg-white/80  pt-[59px] pb-[75px] px-[33px] text-center"
        style={{ backgroundImage: "url('/assets/images/home/radiant.svg')" }}  >
          <Image src={item.icon} width={84} height={84} alt={item.title} className='mx-auto'/>
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
          animation: moveLineLtoR 7.5s linear infinite;
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
          animation: moveLineRtoL 10s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default HowJazzamWork
