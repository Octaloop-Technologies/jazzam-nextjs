
"use client";
import Image from 'next/image';
import React from 'react'
import { Dictionary } from "@/lib/i18n/getDictionary";
const HowJazzamWork = ({ dict }: { dict: Dictionary }) => {
  const features = dict?.home?.jazzamWorks?.features;
  return (
    <div className='bg-bg '>
      <h1 className='text-[52px]!  font-bold leading-13 uppercase text-black text-center pt-[235px]'>  {dict?.home.jazzamWorks?.title}</h1>
      <p className='text-[#777777] text-lg! font-medium leading-6.5 text-center pt-5'>   {dict.home.jazzamWorks.description}</p>
     <div className='relative flex justify-between mx-auto pt-12 max-w-[1300px]'>

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
</div>
 <div className="bg-no-repeat bg-cover bg-center h-[422px] z-50" style={{ backgroundImage: "url('/assets/images/home/bg-wave.svg')" }} >
 <div className='flex gap-5 pt-10 z-20 max-w-[1536px] mx-auto px-2 '>
        {features.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[40px] bg-white/80 pt-[59px] pb-[75px] px-[33px] text-center"
              style={{ backgroundImage: "url('/assets/images/home/radiant.svg')" }}
            >
              <Image
                src={`/assets/icons/${idx === 0 ? "leads.png" :
                                    idx === 1 ? "behavior.png" :
                                    idx === 2 ? "classify-leads.png" :
                                    idx === 3 ? "action.png" :
                                    "improve.png"}`}
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