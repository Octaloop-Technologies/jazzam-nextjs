import OptimizedImage from "@/components/ui/image/OptimizedImage";
import OptimizedVideo from "@/components/ui/video/OptimizedVideo";
import FaqAccordion, { FaqItem } from "@/components/ui/accordion/FaqAccordion";
import { FollowSvg, MeetingSvg, PredictionSvg } from "@/components/view/(main-page)/mainPageSvgs";
import TestimonialsMarquee from "@/components/view/(main-page)/TestimonialsMarquee";
import React from "react";
import { CustomInput } from "@/components/ui/input";
import { CustomTextarea } from "@/components/ui/textarea";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCurrentLang } from "../action";
import WaitlistButton from "@/components/view/(main-page)/WaitlistButton";

const LandingPage = async () => {
  const lang = await getCurrentLang();
  const dict = await getDictionary(lang);

  // FAQ data
  const faqItems: FaqItem[] = [
    {
      id: "1",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question1,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer1,
    },
    {
      id: "2",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question2,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer2,
    },
    {
      id: "3",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question3,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer3,
    },
    {
      id: "4",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question4,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer4,
    },
    {
      id: "5",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question5,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer5,
    },
  ];

  return (
    <div>
      {/* ------------- hero ------------- */}
      <section className="gradient-bg pb-14 pt-20">
        <div className="home-wrapper">
          <div className="text-white leading-tight pb-10">
            <h1 className="text-[60px] uppercase font-[700] max-lg:text-[40px] max-xs:text-[32px]">
              {dict?.home?.hero?.title}
            </h1>
            <p className="mt-2 text-[20px] capitalize font-[500] max-sm:text-[16px]">
              {dict?.home?.hero?.para}
            </p>
          </div>

          <WaitlistButton />

          <div className="mt-10 w-full h-[560px] scale-110 relative max-2xl:scale-100 max-lg:h-[400px] max-md:h-[300px] max-xs:h-[200px]">
            <OptimizedImage
              src="/assets/images/home/hero.png"
              alt="hero-image"
              fill
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* ------------- Choose Jazzam ------------- */}
      <section className="home-padding bg-bg">
        <div className="home-wrapper text-center">
          <h1 className="home-heading">{dict?.home?.whyChooseJazzam?.title}</h1>
          <div className="mt-11 grid grid-cols-3 gap-2.5 items-start max-xl:grid-cols-2 max-md:grid-cols-1">
            {[
              {
                title: dict?.home?.whyChooseJazzam?.smartCustomerFollowUp?.title,
                icon: <FollowSvg />,
                description: dict?.home?.whyChooseJazzam?.smartCustomerFollowUp?.description,
              },
              {
                title: dict?.home?.whyChooseJazzam?.automaticMeetingScheduling?.title,
                icon: <MeetingSvg />,
                description: dict?.home?.whyChooseJazzam?.automaticMeetingScheduling?.description,
              },
              {
                title: dict?.home?.whyChooseJazzam?.accurateSalesPredictions?.title,
                icon: <PredictionSvg />,
                description: dict?.home?.whyChooseJazzam?.accurateSalesPredictions?.description,
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`bg-white h-full rounded-4xl-0 px-[72px] py-[60px] flex-col-center gap-14 max-3xl:gap-10 max-2xl:gap-5 max-sm:px-5 max-sm:py-5 
                  ${index === 2 ? "max-xl:col-span-2" : ""} 
                  ${index === 1 ? "max-md:col-span-2" : ""}`}
              >
                <h2 className="text-[18px] font-[600]">{item.title}</h2>
                <div className="size-[120px] max-2xl:size-[80px] max-sm:size-[60px]">
                  {item.icon}
                </div>
                <p className="text-[14px] font-[500] text-[#333333]">{item.description}</p>
              </div>
            ))}
          </div>
          <button className="mt-10 w-full relative max-w-[290px] h-[60px] bg-[#EEB600] text-white text-[16px] font-[600] rounded-4xl max-sm:h-[50px] max-sm:text-[14px]">
            {dict?.home?.whyChooseJazzam?.registerYourCompany?.title}
            <svg
              className="absolute right-2 top-[40%] -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.58601 17.6852C9.43253 17.8389 9.22428 17.9253 9.00707 17.9255C8.78986 17.9257 8.58149 17.8395 8.42779 17.686C8.27409 17.5326 8.18765 17.3243 8.1875 17.1071C8.18735 16.8899 8.27349 16.6815 8.42697 16.5278L15.134 9.82237H10.6026C10.3855 9.82237 10.1773 9.73613 10.0238 9.58263C9.87034 9.42912 9.7841 9.22093 9.7841 9.00384C9.7841 8.78675 9.87034 8.57855 10.0238 8.42505C10.1773 8.27154 10.3855 8.1853 10.6026 8.1853H17.11C17.3271 8.1853 17.5353 8.27154 17.6888 8.42505C17.8423 8.57855 17.9285 8.78675 17.9285 9.00384V15.5112C17.9285 15.7283 17.8423 15.9365 17.6888 16.09C17.5353 16.2435 17.3271 16.3297 17.11 16.3297C16.8929 16.3297 16.6847 16.2435 16.5312 16.09C16.3777 15.9365 16.2915 15.7283 16.2915 15.5112V10.9798L9.58601 17.6852Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* ------------- See How Jazzam Works ------------- */}
      <section className="home-padding">
        <div className="home-wrapper">
          <div className="flex items-center gap-12 max-3xl:flex-col max-3xl:gap-0">
            <h1 className="home-heading min-w-max max-4xl:min-w-auto max-xl:text-center">
              {dict?.home?.seeHowJazzamWorks?.title}
            </h1>
            <p className="home-desc max-xl:text-center">
              {dict?.home?.seeHowJazzamWorks?.description}
            </p>
          </div>
          <div className="mt-14 w-full h-[560px] p-[40px] relative max-3xl:h-auto max-lg:p-6">
            <div className="size-[320px] absolute top-0 left-0 gradient-bg-2 rounded-tl-4xl-0 max-lg:size-[200px] max-sm:size-[120px]" />
            <div className="size-[320px] absolute bottom-0 right-0 gradient-bg-2 rounded-br-4xl-0 max-lg:size-[200px] max-sm:size-[120px]" />

            <div className="w-full h-full relative rounded-4xl-0 overflow-hidden">
              <OptimizedVideo
                src="/assets/videos/home/how-it-works.mp4"
                controls={false}
                poster="/assets/images/home/dummy.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------- Testimonials ------------- */}
      <TestimonialsMarquee dict={dict} />

      {/* ------------- FAQs ------------- */}
      <section className="home-padding bg-bg">
        <div className="home-wrapper">
          <div className="text-center mb-16">
            <h1 className="home-heading">{dict?.home?.frequentlyAskedQuestions?.title}</h1>
            <p className="home-desc">{dict?.home?.frequentlyAskedQuestions?.description}</p>
          </div>
          <div className="max-w-[1120px] w-full mx-auto">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* ------------- Contact us ------------- */}
      <section className="home-padding">
        <div className="home-wrapper">
          <div className="grid grid-cols-2 gap-28 items-start max-xl:grid-cols-1 max-xl:gap-10 max-lg:items-center">
            {/* Left Side - Contact Info */}
            <div className="space-y-[41px] w-full max-w-[567px] max-xl:max-w-full max-xs:space-y-8">
              <div>
                <h1 className="home-heading">{dict?.home?.contactUs?.title}</h1>
                <p className="mt-2 home-desc">{dict?.home?.contactUs?.description}</p>
              </div>

              {/* Contact Details */}
              <div className="flex-between gap-5 max-xl:justify-center max-xs:flex-col max-xs:items-start">
                {/* Phone */}
                <div className="flex items-center gap-3.5">
                  <div className="size-[60px] min-w-[60px] bg-pri rounded-full flex-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="33"
                      height="32"
                      viewBox="0 0 33 32"
                      fill="none"
                    >
                      <path
                        d="M6.82 19.1583L9.42533 17.309C10.1276 16.8038 10.9167 16.4318 11.7533 16.2116C12.7293 15.9516 13.1667 15.4183 13.1667 14.281C13.1667 11.3943 19.8333 11.0876 19.8333 14.281C19.8333 15.4183 20.2707 15.9516 21.2467 16.2103C22.1027 16.4396 22.8467 16.7903 23.5747 17.309L26.18 19.157C27.3573 19.9943 27.9067 20.3983 28.212 21.0423C28.5 21.6476 28.5 22.357 28.5 23.7756C28.5 26.3276 28.5 27.6036 27.7853 28.421C26.92 29.4116 24.6707 29.3276 23.2893 29.3276H9.71067C8.32933 29.3276 6.12533 29.465 5.21467 28.421C4.5 27.6036 4.5 26.3276 4.5 23.7756C4.5 22.357 4.5 21.6476 4.788 21.0423C5.09467 20.3996 5.64133 19.9943 6.82 19.157V19.1583Z"
                        stroke="white"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M19.1654 22.6667C19.1654 23.3739 18.8844 24.0522 18.3843 24.5523C17.8842 25.0524 17.2059 25.3333 16.4987 25.3333C15.7915 25.3333 15.1132 25.0524 14.6131 24.5523C14.113 24.0522 13.832 23.3739 13.832 22.6667C13.832 21.9594 14.113 21.2811 14.6131 20.781C15.1132 20.281 15.7915 20 16.4987 20C17.2059 20 17.8842 20.281 18.3843 20.781C18.8844 21.2811 19.1654 21.9594 19.1654 22.6667Z"
                        stroke="white"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M9.78153 4.93049C8.02419 5.43182 6.76019 6.05449 5.60286 6.80649C3.77219 7.99582 2.98686 10.1385 3.20286 12.2065C3.29353 13.0812 3.99619 13.4998 4.80953 13.2732C5.42819 13.0998 6.04686 12.9332 6.66153 12.7518C8.45753 12.2185 8.88019 11.5705 9.12953 9.73182L9.78153 4.93049ZM9.78153 4.93049C14.1269 3.69049 18.8762 3.69049 23.2215 4.93049M23.2215 4.93049C24.9789 5.43182 26.2429 6.05449 27.4002 6.80649C29.2309 7.99582 30.0162 10.1385 29.8002 12.2065C29.7095 13.0812 29.0069 13.4998 28.1935 13.2732C27.5762 13.0998 26.9562 12.9332 26.3415 12.7518C24.5455 12.2185 24.1229 11.5705 23.8735 9.73182L23.2215 4.93049Z"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[16px] font-[600] text-[#333333]">
                      {dict?.home?.contactUs?.phone?.title}
                    </p>
                    <p className="text-[14px] font-[400] text-[#666666]">
                      {dict?.home?.contactUs?.phone?.description}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3.5">
                  <div className="size-[60px] min-w-[60px] bg-pri rounded-full flex-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="33"
                      height="32"
                      viewBox="0 0 33 32"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_454_3877)">
                        <path
                          d="M4.61199 4.92285C2.57383 4.92285 0.919678 6.57701 0.919678 8.61516V23.3844C0.919678 25.4225 2.57383 27.0767 4.61199 27.0767H29.2274C31.2655 27.0767 32.9197 25.4225 32.9197 23.3844V8.61516C32.9197 6.57701 31.2655 4.92285 29.2274 4.92285H4.61199ZM4.61199 7.38439H29.2274C29.9055 7.38439 30.4581 7.93701 30.4581 8.61516V9.23054L16.9197 16.5389L3.38122 9.23054V8.61516C3.38122 7.93701 3.93383 7.38439 4.61199 7.38439ZM3.38122 9.57639L11.4194 15.8459L3.53506 23.9235L13.1511 17.0767L16.9197 19.5001L20.6895 17.0767L30.3043 23.9235L22.42 15.8459L30.4581 9.57639V23.3844C30.4513 23.5739 30.3985 23.7589 30.3043 23.9235C30.1012 24.3235 29.7061 24.6152 29.2274 24.6152H4.61199C4.13322 24.6152 3.73814 24.3247 3.53506 23.9235C3.44102 23.7593 3.38822 23.5735 3.38122 23.3844V9.57639Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_454_3877">
                          <rect
                            width="32"
                            height="32"
                            fill="white"
                            transform="translate(0.919678)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[16px] font-[600] text-[#333333]">
                      {dict?.home?.contactUs?.email?.title}
                    </p>
                    <p className="text-[14px] font-[400] text-[#666666]">
                      {dict?.home?.contactUs?.email?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Testimonial */}
              <div className="flex-between gap-5 max-xl:justify-center max-xs:flex-col max-xs:items-start">
                <div className="flex-center gap-3 max-xs:hidden">
                  <div className="flex flex-col -space-y-8">
                    <div className="flex items-center -space-x-2">
                      <div className="size-[83.065px] z-30 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white font-bold">
                        J
                      </div>
                      <div className="size-[70.365px] z-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">
                        A
                      </div>
                    </div>
                    <div className="flex items-center -space-x-2">
                      <div className="size-[70.365px] z-40 rounded-full bg-gradient-to-r from-pink-400 to-red-500 border-2 border-white flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div className="size-[83.065px] z-50 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-white font-bold">
                        S
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[30px] font-[600] leading-none">
                      {dict?.home?.contactUs?.registeredUsers?.title}
                    </h3>
                    <h5 className="text-[16px] font-[400]">
                      {dict?.home?.contactUs?.registeredUsers?.description}
                    </h5>
                  </div>
                </div>

                <div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} />
                    ))}
                  </div>
                  <p className="mt-1 text-[16px]">{dict?.home?.contactUs?.reviews?.description}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="">
              <form className="space-y-[28px] text-[14px]">
                <CustomInput
                  label={dict?.home?.contactUs?.form?.fullName}
                  placeholder={dict?.home?.contactUs?.form?.fullNamePlaceholder}
                />
                <CustomInput
                  label={dict?.home?.contactUs?.form?.email}
                  placeholder={dict?.home?.contactUs?.form?.emailPlaceholder}
                />
                <CustomInput
                  label={dict?.home?.contactUs?.form?.company}
                  placeholder={dict?.home?.contactUs?.form?.companyPlaceholder}
                />
                <CustomTextarea
                  label={dict?.home?.contactUs?.form?.message}
                  placeholder={dict?.home?.contactUs?.form?.messagePlaceholder}
                />
                <SubmitButton title={dict?.home?.contactUs?.form?.submitButton} />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

// ------------- Star Icon -------------
const StarIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
      <path
        d="M16.4661 7.38354C16.4189 7.24464 16.3321 7.12259 16.2164 7.03246C16.1007 6.94233 15.9611 6.88806 15.8149 6.87636L11.5376 6.53649L9.68663 2.43924C9.62768 2.30727 9.5318 2.19519 9.41056 2.11651C9.28932 2.03784 9.1479 1.99593 9.00337 1.99585C8.85884 1.99577 8.71738 2.03752 8.59605 2.11607C8.47472 2.19461 8.37872 2.30659 8.31963 2.43849L6.4687 6.53649L2.19139 6.87636C2.04768 6.88774 1.91029 6.94029 1.79566 7.02771C1.68103 7.11514 1.59401 7.23373 1.54502 7.36931C1.49603 7.50489 1.48713 7.65172 1.5194 7.79222C1.55167 7.93273 1.62373 8.06096 1.72697 8.16158L4.88787 11.243L3.76997 16.0837C3.73602 16.2303 3.7469 16.3836 3.80119 16.5239C3.85548 16.6641 3.95068 16.7849 4.07443 16.8703C4.19818 16.9558 4.34476 17.0022 4.49517 17.0033C4.64557 17.0044 4.79285 16.9604 4.91788 16.8768L9.00313 14.1533L13.0884 16.8768C13.2162 16.9616 13.3669 17.0053 13.5203 17.0019C13.6736 16.9986 13.8223 16.9483 13.9462 16.858C14.0702 16.7676 14.1635 16.6414 14.2136 16.4964C14.2637 16.3514 14.2682 16.1946 14.2265 16.047L12.8543 11.2452L16.2575 8.18259C16.4804 7.98151 16.5621 7.6679 16.4661 7.38354Z"
        fill="#FF9B36"
      />
    </svg>
  );
};

// ------------- Submit Button -------------
const SubmitButton = ({ title }: { title: string }) => {
  return (
    <button
      type="submit"
      className="w-full ml-auto max-w-[184px] relative h-[54px] bg-pri text-white text-[16px] font-[600] rounded-4xl hover:bg-pri/80 transition-colors duration-200 flex-center gap-2"
    >
      {title}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="27"
        viewBox="0 0 28 27"
        fill="none"
        className="absolute right-2 top-[40%] -translate-y-1/2"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.4254 17.6855C10.2719 17.8392 10.0636 17.9256 9.84642 17.9257C9.62921 17.9259 9.42084 17.8398 9.26714 17.6863C9.11344 17.5328 9.02701 17.3245 9.02686 17.1073C9.0267 16.8901 9.11284 16.6818 9.26632 16.5281L15.9734 9.82262H11.442C11.2249 9.82262 11.0167 9.73638 10.8632 9.58287C10.7097 9.42937 10.6235 9.22117 10.6235 9.00408C10.6235 8.78699 10.7097 8.5788 10.8632 8.42529C11.0167 8.27179 11.2249 8.18555 11.442 8.18555H17.9493C18.1664 8.18555 18.3746 8.27179 18.5281 8.42529C18.6816 8.5788 18.7679 8.78699 18.7679 9.00408V15.5114C18.7679 15.7285 18.6816 15.9367 18.5281 16.0902C18.3746 16.2437 18.1664 16.33 17.9493 16.33C17.7323 16.33 17.5241 16.2437 17.3706 16.0902C17.217 15.9367 17.1308 15.7285 17.1308 15.5114V10.98L10.4254 17.6855Z"
          fill="white"
        />
      </svg>
    </button>
  );
};
