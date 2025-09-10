"use client";

import { Marquee, TextMarquee } from "@/components/ui/marquee";
import OptimizedImage from "@/components/ui/image/OptimizedImage";

interface Testimonial {
  id: number;
  name: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Liam Patel",
    content:
      "Working with Octaloop was a breeze. They understood my vision and executed it flawlessly. Highly professional team!",
    avatar: "/assets/images/leads/dummy-profile.png",
    rating: 5,
  },
  {
    id: 2,
    name: "Liam Patel",
    content:
      "Working with Octaloop was a breeze. They understood my vision and executed it flawlessly. Highly professional team!",
    avatar: "/assets/images/leads/dummy-profile.png",
    rating: 5,
  },
  {
    id: 3,
    name: "Liam Patel",
    content:
      "Working with Octaloop was a breeze. They understood my vision and executed it flawlessly. Highly professional team!",
    avatar: "/assets/images/leads/dummy-profile.png",
    rating: 5,
  },
  {
    id: 4,
    name: "Liam Patel",
    content:
      "Working with Octaloop was a breeze. They understood my vision and executed it flawlessly. Highly professional team!",
    avatar: "/assets/images/leads/dummy-profile.png",
    rating: 5,
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="368"
        height="287"
        viewBox="0 0 368 287"
        fill="none"
      >
        <path
          d="M215.791 0C219.055 0 222.114 1.59367 223.985 4.26911L257.876 52.7309C259.747 55.4063 262.806 57 266.071 57H358C363.523 57 368 61.4772 368 67V277C368 282.523 363.523 287 358 287H10C4.47716 287 0 282.523 0 277V10C0 4.47715 4.47715 0 10 0H215.791Z"
          fill="white"
        />
        <foreignObject x="20" y="20" width="328" height="247">
          <div className="h-full p-6">
            <p className="text-[14px] font-[500] text-[#444444]">{testimonial.content}</p>

            <div className="flex items-center gap-4">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M16.4661 7.38354C16.4189 7.24464 16.3321 7.12259 16.2164 7.03246C16.1007 6.94233 15.9611 6.88806 15.8149 6.87636L11.5376 6.53649L9.68663 2.43924C9.62768 2.30727 9.5318 2.19519 9.41056 2.11651C9.28932 2.03784 9.1479 1.99593 9.00337 1.99585C8.85884 1.99577 8.71738 2.03752 8.59605 2.11607C8.47472 2.19461 8.37872 2.30659 8.31963 2.43849L6.4687 6.53649L2.19139 6.87636C2.04768 6.88774 1.91029 6.94029 1.79566 7.02771C1.68103 7.11514 1.59401 7.23373 1.54502 7.36931C1.49603 7.50489 1.48713 7.65172 1.5194 7.79222C1.55167 7.93273 1.62373 8.06096 1.72697 8.16158L4.88787 11.243L3.76997 16.0837C3.73602 16.2303 3.7469 16.3836 3.80119 16.5239C3.85548 16.6641 3.95068 16.7849 4.07443 16.8703C4.19818 16.9558 4.34476 17.0022 4.49517 17.0033C4.64557 17.0044 4.79285 16.9604 4.91788 16.8768L9.00313 14.1533L13.0884 16.8768C13.2162 16.9616 13.3669 17.0053 13.5203 17.0019C13.6736 16.9986 13.8223 16.9483 13.9462 16.858C14.0702 16.7676 14.1635 16.6414 14.2136 16.4964C14.2637 16.3514 14.2682 16.1946 14.2265 16.047L12.8543 11.2452L16.2575 8.18259C16.4804 7.98151 16.5621 7.6679 16.4661 7.38354Z"
                    fill="#FF9B36"
                  />
                </svg>
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

const TestimonialsMarquee: React.FC = () => {
  return (
    <>
      <div></div>

      <div className="py-[100px] bg-bg">
        <TextMarquee
          text={[
            "Innovation",
            "Development",
            "Immersion",
            "Scalability",
            "Visualization",
            "Intelligence",
            "Transformation",
          ]}
          speed={50}
          direction="left"
          textClassName="text-[17px] font-[500] tracking-[1.5px]"
        />
      </div>

      <div className="py-[100px] bg-white">
        <Marquee speed={30} direction="left">
          <div className="flex gap-[25px]">
            {testimonialsData.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Marquee>
      </div>
    </>
  );
};

export default TestimonialsMarquee;
