"use client";

import { Marquee, TextMarquee } from "@/components/ui/marquee";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="relative flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="368"
        height="320"
        viewBox="0 0 368 320"
        fill="none"
      >
        <path
          d="M215.791 0C219.055 0 222.114 1.59367 223.985 4.26911L257.876 52.7309C259.747 55.4063 262.806 57 266.071 57H358C363.523 57 368 61.4772 368 67V277C368 282.523 363.523 287 358 287H10C4.47716 287 0 282.523 0 277V10C0 4.47715 4.47715 0 10 0H215.791Z"
          fill="white"
        />
        <foreignObject x="20" y="20" width="328" height="280">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="51"
                height="51"
                viewBox="0 0 51 51"
                fill="none"
              >
                <path
                  d="M17.85 15.3L20.4 10.2H15.3C9.66451 10.2 5.10001 17.3145 5.10001 22.95V40.7999H22.95V22.95H12.75C12.75 15.3 17.85 15.3 17.85 15.3ZM35.7 22.95C35.7 15.3 40.8 15.3 40.8 15.3L43.35 10.2H38.25C32.6145 10.2 28.05 17.3145 28.05 22.95V40.7999H45.9V22.95H35.7Z"
                  fill="#15803C"
                />
              </svg>

              <p className="mt-3 text-[14px] font-[500] text-[#444444] max-w-[280px] w-full break-words leading-relaxed">
                {testimonial.content}
              </p>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <div className="size-[60px] rounded-full overflow-hidden">
                <OptimizedImage
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-[600]">{testimonial.name}</h3>
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <StarIcon key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

const TestimonialsMarquee: React.FC<{ dict: Dictionary }> = ({ dict }) => {
  // Testimonials data
  const testimonialsData: Testimonial[] = [
    {
      id: 1,
      name: dict?.home?.testimonials?.testimonial?.name,
      content: dict?.home?.testimonials?.testimonial?.content,
      avatar: "/assets/images/leads/dummy-profile.png",
      rating: 5,
    },
    {
      id: 2,
      name: dict?.home?.testimonials?.testimonial?.name,
      content: dict?.home?.testimonials?.testimonial?.content,
      avatar: "/assets/images/leads/dummy-profile.png",
      rating: 5,
    },
    {
      id: 3,
      name: dict?.home?.testimonials?.testimonial?.name,
      content: dict?.home?.testimonials?.testimonial?.content,
      avatar: "/assets/images/leads/dummy-profile.png",
      rating: 5,
    },
    {
      id: 4,
      name: dict?.home?.testimonials?.testimonial?.name,
      content: dict?.home?.testimonials?.testimonial?.content,
      avatar: "/assets/images/leads/dummy-profile.png",
      rating: 5,
    },
  ];

  // Marquee data
  const marqueeData = [
    dict?.home?.marquee?.title,
    dict?.home?.marquee?.description,
    dict?.home?.marquee?.immersion,
    dict?.home?.marquee?.scalability,
    dict?.home?.marquee?.visualization,
    dict?.home?.marquee?.customerSatisfaction,
  ];

  const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.testimonials?.title || "",
    paragraphText: dict?.home?.testimonials?.description || "",
  });

  return (
    <>
      <div className="home-padding bg-bg">
        <TextMarquee
          text={marqueeData}
          speed={50}
          direction="left"
          textClassName="text-[17px] font-[500] tracking-[1.5px] max-lg:text-[14px] max-sm:text-[12px]"
        />
      </div>

      <div className="relative overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1043 705"
          fill="none"
          width="100%"
          height="100%"
          className="absolute top-0 left-1/2 -translate-x-1/2"
        >
          <path
            opacity="0.06"
            d="M213.065 541.561L1026.55 709.743C1049.11 714.374 1047.12 684 1024.14 672.967L569.379 453.565C565.944 451.912 562.646 449.524 559.802 446.63C556.957 443.735 554.661 440.43 553.134 437.032C551.607 433.634 550.899 430.257 551.078 427.224C551.258 424.19 552.319 421.603 554.159 419.708L785.145 180.515C787.252 178.328 788.321 175.232 788.217 171.617C788.112 168.001 786.84 164.026 784.56 160.19C782.279 156.355 779.092 152.828 775.397 150.053C771.702 147.279 767.663 145.379 763.788 144.592L16.1734 -4.73713C-5.47804 -9.06 -4.59564 19.3873 17.357 31.3645L407.345 243.76C410.651 245.561 413.771 248.024 416.424 250.925C419.077 253.826 421.179 257.074 422.54 260.375C423.901 263.676 424.478 266.927 424.219 269.832C423.96 272.738 422.873 275.207 421.056 277.017L191.886 505.453C189.711 507.597 188.577 510.67 188.627 514.284C188.676 517.898 189.908 521.89 192.166 525.755C194.424 529.619 197.606 533.182 201.31 535.993C205.014 538.803 209.072 540.735 212.972 541.544"
            fill="#15803C"
          />
        </svg>

        <div className="pt-[70px] flex-between home-wrapper max-md:flex-col max-md:items-start max-md:gap-5 max-2xl:pt-10">
          <div ref={containerRef}>
            <h1 className="home-heading" ref={titleRef}>
              {dict?.home?.testimonials?.title}
            </h1>
            <h4 className="home-desc" ref={paragraphRef}>
              {dict?.home?.testimonials?.description}
            </h4>
          </div>
          <div className="flex items-end gap-12 max-lg:gap-5 max-lg:flex-col max-md:flex-row max-md:justify-between max-md:w-full">
            <div>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
              <h3 className="text-[16px]">{dict?.home?.testimonials?.reviews}</h3>
            </div>
            <div className="w-full max-md:w-auto">
              <h1 className="text-[50px] font-[700] uppercase leading-none max-lg:text-[40px] max-sm:text-[32px]">
                92%
              </h1>
              <h4 className="text-[14px] leading-tight max-sm:text-[12px]">
                {dict?.home?.testimonials?.customerSatisfaction}
              </h4>
            </div>
          </div>
        </div>

        <div className="home-padding bg-white">
          <Marquee speed={30} direction="left" className="w-full">
            <div className="flex gap-[25px] items-center">
              {[...Array(3)].map((_, groupIndex) =>
                testimonialsData.map((testimonial) => (
                  <TestimonialCard
                    key={`${testimonial.id}-${groupIndex}`}
                    testimonial={testimonial}
                  />
                ))
              )}
            </div>
          </Marquee>
        </div>
      </div>
    </>
  );
};

export default TestimonialsMarquee;

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
