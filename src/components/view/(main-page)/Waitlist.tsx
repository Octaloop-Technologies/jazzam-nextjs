"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { Dictionary } from "@/lib/i18n/getDictionary";
import { useToast } from '@/lib/hooks/useToast';
import { joinWaitlist } from '@/lib/api/main-page';
import emailjs from "@emailjs/browser";

interface WaitlistProps {
    dict: Dictionary,
}

const emailJsKey: string = process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ''

emailjs.init(emailJsKey);


const Waitlist = ({ dict }: WaitlistProps) => {

    const [waitlistEmail, setWaitlistEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const emailServiceId: string = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ?? '';
    const emailTemplateId: string = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID ?? '';

    const { success, error: ErrorToast } = useToast()

    const checkEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const callWaitlistApi = async () => {
        if (waitlistEmail === "") {
            ErrorToast(dict.home.toastMsgs.emailNotSent)
            return;
        }

        if(!checkEmail(waitlistEmail)){
            ErrorToast("Email is not valid. Please! enter valid email");
            return;
        }

        try {
            setLoading(true);
            // await emailjs.send(emailServiceId, emailTemplateId, {
            //     email: waitlistEmail.trim()
            // })
            const response = await joinWaitlist(waitlistEmail.trim(), "", "website", {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                referrer: document.referrer || "direct",
            });
            if (response.success) {
                success(dict?.home?.toastMsgs.emailSent);
                setWaitlistEmail("")
            } else {
                // ErrorToast("dict?.home?.toastMsgs?.errorEmail");
                throw new Error(response.error)
            }
        } catch (error) {
            if(error.message === "Email already exists in waitlist"){
                ErrorToast(`${dict?.home?.toastMsgs?.emailAlready}`)
            }
            else{
                ErrorToast(`${dict?.home?.toastMsgs?.errorEmail} ${waitlistEmail}`)
            }
            setWaitlistEmail("")
            setLoading(false);
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="px-4 sm:px-8 md:px-[60px] lg:px-[100px] pb-[50px] md:pb-[100px] pt-[30px] md:pt-[130px] lg:pt-[154px] max-w-[1536px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-11.5 items-start">
            {/* Left Side Content */}
            <div
                className={`flex-1 text-center`}
            >
                <p className="text-[28px] sm:text-[48px] md:text-[60px] lg:text-[72px] pb-5 md:pb-8.5 text-black font-bold leading-[1.2] uppercase pt-10 lg:pt-25">
                    <span>{dict?.home?.hero?.title}</span>
                    <span className="text-[#1BA54E]">{dict?.home?.hero?.spanTitle}</span>{" "}
                    <span>{dict?.home?.hero?.titele2}</span>
                </p>

                <p className="text-[#444] text-sm sm:text-lg pb-6 md:pb-13.5 font-medium leading-[1.6] capitalize max-w-[546px] w-full mx-auto lg:mx-0">
                    {dict?.home?.hero?.para}
                </p>

                <p className="text-base sm:text-lg font-bold leading-7 capitalize text-black pb-3 md:pb-[15px]">
                    {dict?.home?.hero?.heading}
                </p>

                {/* Input + Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2.5 w-full max-w-[500px] mx-auto lg:mx-0">
                    <div className="bg-[#F4F4F4] flex flex-1 items-center gap-2 py-3 sm:py-4 px-4 sm:px-5 h-[55px] sm:h-15 rounded-[14px] border border-[#EBEBEB] backdrop-blur-[2px]">
                        <Image
                            src="/assets/icons/mail.png"
                            width={24}
                            height={24}
                            alt="mail"
                            className="shrink-0"
                        />
                        <input
                            type="email"
                            placeholder={dict?.home?.hero?.emailHeading}
                            className="bg-transparent outline-none text-sm text-black w-full"
                            value={waitlistEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaitlistEmail(e.target.value)}
                        />
                    </div>
                    <button onClick={callWaitlistApi} className="h-[55px] sm:h-15 w-full sm:w-auto px-6 sm:pl-12.5 sm:pr-[35px] flex items-center justify-center 
                    bg-[#EEB600] border-[1.5px] border-[#EEB600] rounded-[14px] text-white text-base uppercase font-semibold cursor-pointer">
                        {loading ? 'Sending' : dict?.home?.hero?.sendNow}
                    </button>
                </div>
            </div>

            {/* Right Side Video + Image */}
            <div className="relative w-full lg:w-[50%] h-[280px] sm:h-[400px] md:h-[500px] lg:h-[707px] z-10 overflow-hidden rounded-2xl md:rounded-4xl mt-10 lg:mt-0">
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
                        height={400}
                        width={400}
                        alt="img"
                        className="w-[350px] sm:w-[350px] md:w-[450px] lg:w-[600px] h-auto"
                    />
                </div>
            </div>
        </section>
    );
}

export default Waitlist;
