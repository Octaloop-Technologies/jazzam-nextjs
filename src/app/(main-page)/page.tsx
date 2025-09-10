import Language from "@/components/shared/language/Language";
import Logo from "@/components/shared/logo/Logo";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import OptimizedVideo from "@/components/ui/video/OptimizedVideo";
import FaqAccordion, { FaqItem } from "@/components/ui/accordion/FaqAccordion";
import { FollowSvg, MeetingSvg, PredictionSvg } from "@/components/view/(main-page)/mainPageSvgs";
import TestimonialsMarquee from "@/components/view/(main-page)/TestimonialsMarquee";
import React from "react";

const LandingPage = () => {
  // FAQ data
  const faqItems: FaqItem[] = [
    {
      id: "1",
      question: "How does the AI generate leads?",
      answer:
        "Our AI uses advanced algorithms to analyze market data, customer behavior patterns, and industry trends to identify high-quality prospects that match your ideal customer profile. It continuously learns from successful conversions to improve lead quality over time.",
    },
    {
      id: "2",
      question: "Is the system easy to integrate with my CRM?",
      answer:
        "Yes, Jazzam integrates seamlessly with popular CRM systems like Salesforce, HubSpot, Pipedrive, and more. Our setup team will help you configure the integration, usually completed within 24-48 hours with minimal disruption to your current workflow.",
    },
    {
      id: "3",
      question: "Can I customize the lead capture form to match my business needs?",
      answer:
        "Absolutely! Our platform offers extensive customization options for lead capture forms. You can add custom fields, adjust the design to match your brand, set up conditional logic, and create different forms for different campaigns or landing pages.",
    },
    {
      id: "4",
      question: "What are the benefits of using AI in content creation?",
      answer:
        "AI-powered content creation helps you generate personalized messages, email sequences, and follow-up content at scale. It ensures consistent messaging, saves time on content creation, and adapts content based on lead behavior and preferences to improve engagement rates.",
    },
    {
      id: "5",
      question: "How long will it take to set up the system?",
      answer:
        "Most implementations are completed within 3-5 business days. This includes initial setup, CRM integration, team training, and testing. Our dedicated onboarding team will guide you through each step to ensure a smooth transition and quick time-to-value.",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* ------------- navbar ------------- */}
      <div className="home-wrapper py-[14px]">
        <nav className="flex-between">
          <Logo />
          <div className="flex-center gap-5">
            <div className="rounded-xl-2 border border-gray-b h-[52px] w-[138px] flex-center">
              <Language />
            </div>
            <PrimaryButton title="Get started" className="h-[52px] w-[138px] rounded-xl-2" />
          </div>
        </nav>
      </div>

      {/* ------------- hero ------------- */}
      <section className="gradient-bg pb-14 pt-20">
        <div className="home-wrapper">
          <div className="text-white leading-tight pb-16">
            <h1 className="text-[60px] uppercase font-[700]">
              Transform Your Sales Team into a Deal-Closing Machine with AI
            </h1>
            <p className="mt-2 text-[20px] capitalize font-[500]">
              Jazzam – Smart AI Sales Agent (SaaS) helps your team connect with the right customers
              and close deals 40% faster.
            </p>
          </div>
          <div className="w-full h-[560px] scale-120 relative">
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
      <section className="py-[100px] bg-bg">
        <div className="home-wrapper text-center">
          <h1 className="text-[52px] font-[700] uppercase">Why Choose Jazzam?</h1>
          <div className="mt-11 grid grid-cols-3 gap-2.5">
            {[
              {
                title: "Smart Customer Follow-up",
                icon: <FollowSvg />,
                description:
                  "Never miss a sales opportunity with the advanced automated follow-up system.",
              },
              {
                title: "Automatic Meeting Scheduling",
                icon: <MeetingSvg />,
                description:
                  "Coordinates appointments with your team & clients without manual intervention.",
              },
              {
                title: "Accurate Sales Predictions",
                icon: <PredictionSvg />,
                description:
                  "Smart reports enable swift decision-making, allowing you to act quickly and effectively.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-4xl-0 px-[72px] py-[60px] flex-col-center gap-14"
              >
                <h2 className="text-[18px] font-[600]">{item.title}</h2>
                <div className="size-[120px]">{item.icon}</div>
                <p className="text-[14px] font-[500] text-[#333333]">{item.description}</p>
              </div>
            ))}
          </div>
          <button className="mt-10 w-full relative max-w-[290px] h-[60px] bg-[#EEB600] text-white text-[16px] font-[600] rounded-4xl">
            Register your company
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
      <section className="py-[80px]">
        <div className="home-wrapper">
          <div className="flex items-center gap-12">
            <h1 className="text-[52px] font-[700] uppercase min-w-max">See How Jazzam Works</h1>
            <p className="text-[20px] font-[500] text-[#666]">
              A Short video explaining the customer journey from registration to deal closure
            </p>
          </div>
          <div className="mt-14 w-full h-[560px] p-[40px] relative">
            <div className="size-[320px] absolute top-0 left-0 gradient-bg-2 rounded-tl-4xl-0" />
            <div className="size-[320px] absolute bottom-0 right-0 gradient-bg-2 rounded-br-4xl-0" />

            <div className="w-full h-full relative rounded-4xl-0 overflow-hidden">
              <OptimizedVideo
                src="/assets/videos/home/how-it-works.mp4"
                objectFit="cover"
                controls={false}
                poster="/assets/images/home/dummy.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------- Testimonials ------------- */}
      <TestimonialsMarquee />

      {/* ------------- FAQs ------------- */}
      <section className="py-[100px] bg-bg">
        <div className="home-wrapper">
          <div className="text-center mb-16">
            <h1 className="text-[52px] font-[700] uppercase mb-4">Frequently Asked Questions</h1>
            <p className="text-[20px] font-[500] text-[#666666] max-w-2xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about our programs.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* ------------- Contact us ------------- */}
      <section className="py-[100px]">
        <div className="home-wrapper">
          <div className="grid grid-cols-2 gap-20 items-start">
            {/* Left Side - Contact Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-[52px] font-[700] uppercase mb-4">CONTACT US</h1>
                <p className="text-[16px] font-[400] text-[#666666] leading-relaxed">
                  have questions or feedback? we're here to help. Send us a message, and we'll
                  respond within 24 hours.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#15803c] rounded-full flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4865 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[16px] font-[600] text-[#333333]">Phone</p>
                    <p className="text-[14px] font-[400] text-[#666666]">+44-7398900</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#15803c] rounded-full flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="L22 6L12 13L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[16px] font-[600] text-[#333333]">Email</p>
                    <p className="text-[14px] font-[400] text-[#666666]">jazzam@company.com</p>
                  </div>
                </div>
              </div>

              {/* User Testimonial */}
              <div className="flex items-center gap-4 mt-12">
                <div className="flex -space-x-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-red-500 border-2 border-white flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-white font-bold">
                    S
                  </div>
                </div>
                <div>
                  <p className="text-[18px] font-[600] text-[#333333]">16K +</p>
                  <p className="text-[14px] font-[400] text-[#666666]">Registered users</p>
                  <p className="text-[12px] font-[400] text-[#15803c] mt-1">
                    5.0 from 10k+ reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white border border-gray-b rounded-[24px] p-8 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-[500] text-[#333333] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full h-[48px] px-4 border border-gray-b rounded-[12px] outline-none focus:ring-1 focus:ring-[#15803c] focus:border-[#15803c] placeholder:text-[#7e7e7e] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-[500] text-[#333333] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Your email@company.com"
                      className="w-full h-[48px] px-4 border border-gray-b rounded-[12px] outline-none focus:ring-1 focus:ring-[#15803c] focus:border-[#15803c] placeholder:text-[#7e7e7e] text-[14px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-[500] text-[#333333] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your company or institution"
                    className="w-full h-[48px] px-4 border border-gray-b rounded-[12px] outline-none focus:ring-1 focus:ring-[#15803c] focus:border-[#15803c] placeholder:text-[#7e7e7e] text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-[500] text-[#333333] mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message here"
                    className="w-full px-4 py-3 border border-gray-b rounded-[12px] outline-none focus:ring-1 focus:ring-[#15803c] focus:border-[#15803c] placeholder:text-[#7e7e7e] text-[14px] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full h-[52px] bg-[#15803c] text-white text-[16px] font-[600] rounded-[12px] hover:bg-[#0fb981] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  SUBMIT
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ------------- footer ------------- */}
      <div className="bg-[#181818] pt-[42px]">
        <div className="home-wrapper">
          <footer className="flex-col-center gap-[30px] text-center">
            <Logo titleClassName="text-white" />

            <p className="text-[14px] font-[300] leading-[2] max-w-[60%] text-white/80">
              Transform Your Sales Team into a Deal-Closing Machine with AI. Jazzam – Smart AI Sales
              Agent (SaaS) helps your team connect with the right customers and close deals 40%
              faster.
            </p>

            <p className="w-full py-[15px] text-[14px] opacity-[0.75] font-[500] text-white border-t border-gray-b/20">
              © {new Date().getFullYear()} | octaloop.io All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
