"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface TextMarqueeProps {
  text: string[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  textClassName?: string;
  separator?: string;
  repetitions?: number;
}

const TextMarquee: React.FC<TextMarqueeProps> = ({
  text,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = "",
  textClassName = "",
  separator = " • ",
  repetitions = 3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollingRef.current) return;

    const container = containerRef.current;
    const scrollingElement = scrollingRef.current;

    // Wait for content to render
    const timer = setTimeout(() => {
      // Get content width (half since we duplicate content)
      const fullContentWidth = scrollingElement.offsetWidth;
      const singleContentWidth = fullContentWidth / 2;

      // Calculate duration based on speed
      const duration = singleContentWidth / speed;

      // Set initial position based on direction
      if (direction === "left") {
        gsap.set(scrollingElement, { x: 0 });
      } else {
        gsap.set(scrollingElement, { x: -singleContentWidth });
      }

      // Create infinite animation
      const tl = gsap.timeline({ repeat: -1 });

      if (direction === "left") {
        tl.to(scrollingElement, {
          x: -singleContentWidth,
          duration,
          ease: "none",
        });
      } else {
        tl.to(scrollingElement, {
          x: 0,
          duration,
          ease: "none",
        });
      }

      animationRef.current = tl;
    }, 100);

    // Pause on hover functionality
    if (pauseOnHover && container) {
      const handleMouseEnter = () => {
        // Smooth pause using timeScale
        gsap.to(animationRef.current, {
          timeScale: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        // Smooth resume using timeScale
        gsap.to(animationRef.current, {
          timeScale: 1,
          duration: 0.5,
          ease: "power2.in",
        });
      };

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        clearTimeout(timer);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        animationRef.current?.kill();
      };
    }

    return () => {
      clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, speed, direction, pauseOnHover, separator, repetitions]);

  // Create the repeated content for seamless scrolling
  const createRepeatedContent = (): React.ReactElement[] => {
    const items: React.ReactElement[] = [];

    for (let rep = 0; rep < repetitions; rep++) {
      text.forEach((item, index) => {
        items.push(
          <span
            key={`${rep}-${index}`}
            className={`flex items-center justify-center bg-pri h-[71px] px-[30px] rounded-5xl text-white max-lg:h-[50px] max-lg:px-[20px] max-sm:h-[40px] max-sm:px-[10px] ${textClassName}`}
          >
            {item}
          </span>
        );

        // Add star separator after each item except the last one in the last repetition
        // if (!(rep === repetitions - 1 && index === text.length - 1)) {
        items.push(
          <svg
            key={`star-${rep}-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            className="mx-4"
          >
            <path
              d="M7.21621 0.927091C7.23548 0.503283 7.93283 0.333765 8.14088 0.703634C9.11949 2.43739 10.7839 4.98409 12.6718 6.14378C14.5596 7.29962 17.5879 7.63096 19.576 7.71572C19.9998 7.73499 20.1655 8.43234 19.7956 8.64039C18.0618 9.61901 15.519 11.2834 14.3593 13.1713C13.1996 15.0592 12.8721 18.0875 12.7874 20.0755C12.7681 20.4993 12.0669 20.665 11.8627 20.2951C10.8841 18.5613 9.21967 16.0185 7.32794 14.8588C5.44007 13.6991 2.41177 13.3716 0.427584 13.2869C0.00377648 13.2676 -0.165749 12.5664 0.20412 12.3622C1.93788 11.3836 4.48458 9.71918 5.64427 7.82745C6.80011 5.93958 7.13145 2.91128 7.21621 0.927091Z"
              fill="#EEB600"
            />
          </svg>
        );
        // }
      });
    }

    return items;
  };

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={scrollingRef} className="inline-flex items-center">
        {createRepeatedContent()}
        {/* Duplicate content for seamless loop */}
        {createRepeatedContent()}
      </div>
    </div>
  );
};

export default TextMarquee;
