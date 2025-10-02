// "use client";

// import { Dictionary } from "@/lib/i18n/getDictionary";
// import WaitlistButton from "./WaitlistButton";
// import OptimizedImage from "@/components/ui/image/OptimizedImage";
// import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";

// const Hero = ({ dict }: { dict: Dictionary }) => {
//   const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
//     titleText: dict?.home?.hero?.title || "",
//     paragraphText: dict?.home?.hero?.para || "",
//   });

//   return (
//     <section className="gradient-bg pb-14 pt-20">
//       <div className="home-wrapper">
//         <div ref={containerRef} className="text-white pb-10">
//           <h1
//             ref={titleRef}
//             className="text-[60px] uppercase font-[700] max-lg:text-[40px] max-xs:text-[32px] leading-tight transform-gpu"
//           >
//             {dict?.home?.hero?.title}
//           </h1>
//           <p
//             ref={paragraphRef}
//             className="mt-4 text-[20px] capitalize font-[500] max-sm:text-[16px] transform-gpu"
//           >
//             {dict?.home?.hero?.para}
//           </p>
//         </div>

//         <WaitlistButton />

//         <div className="mt-10 w-full h-[560px] scale-110 relative max-2xl:scale-100 max-lg:h-[400px] max-md:h-[300px] max-xs:h-[200px]">
//           <OptimizedImage
//             src="/assets/images/home/hero.png"
//             alt="hero-image"
//             fill
//             className="w-full h-full object-contain"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;


import Image from 'next/image'
import React from 'react'
import { Dictionary } from "@/lib/i18n/getDictionary";
const Hero = ({ dict }: { dict: Dictionary }) => {
  return (
    <section className='bg-bg px-[100px] pt-[154px] max-w-[1536px]  mx-auto flex  gap-11.5'>
      <div>
        <p className='text-[72px]! pb-8.5 text-black font-bold leading-20 pt-25 uppercase'><span>{dict?.home?.hero?.title}</span><span className='text-[#1BA54E]'>{dict?.home?.hero?.spanTitle}</span> <span>{dict?.home?.hero?.titele2}</span></p>
        <p className='text-[#444] text-lg! pb-13.5 font-medium leading-6 capitalize max-w-[546px] w-full'>{dict?.home?.hero?.para}</p>
        <p className='text-lg! font-bold leading-7 capitalize text-black pb-[15px]'>{dict?.home?.hero?.heading}</p>
        <div className='flex gap-2.5 w-full'>
        <div className='bg-[#F4F4F4] flex flex-[0.7] items-center gap-2 py-4 px-5 h-15 rounded-[14px] border border-[#EBEBEB] backdrop-blur-[2px]'>
<Image src="/assets/icons/mail.png" width={24} height={24} alt="mail"/>
  <input
    type="email"
    placeholder={dict?.home?.hero?.emailHeading}
    className="bg-transparent outline-none text-sm text-[#999999] w-full"
  />
        </div>
        <button className='h-15 pl-12.5 pr-[35px] flex items-center justify-center bg-[#EEB600] border-[1.5px] border-[#EEB600] rounded-[14px]  text-white text-base uppercase font-semibold'>
          {dict?.home?.hero?.sendNow}</button>
      </div>
      </div>
<div className="relative w-[666px] h-[707px] z-10 overflow-hidden rounded-4xl">
  {/* Background video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover"
  >
    <source src="/assets/glass.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Centered Image */}
  <div className="absolute inset-0 flex items-center justify-center z-20">
    <Image 
      src="/assets/images/home/mackbook.svg" 
      height={609} 
      width={600} 
      alt="img" 
    />
  </div>
</div>


      
    </section>
  )
}

export default Hero