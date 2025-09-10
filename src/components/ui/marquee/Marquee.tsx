"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = "",
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) return;

    const marqueeElement = marqueeRef.current;
    const contentElement = contentRef.current;

    // Clone the content to create seamless loop
    const clone = contentElement.cloneNode(true) as HTMLElement;
    marqueeElement.appendChild(clone);

    // Get dimensions
    const contentWidth = contentElement.offsetWidth;
    const marqueeWidth = marqueeElement.offsetWidth;

    // Calculate duration based on speed and content width
    const duration = contentWidth / speed;

    // Set initial position
    gsap.set([contentElement, clone], {
      x: direction === "left" ? 0 : -contentWidth,
    });

    // Create the animation
    const tl = gsap.timeline({ repeat: -1 });

    if (direction === "left") {
      tl.to([contentElement, clone], {
        x: -contentWidth,
        duration,
        ease: "none",
      });
    } else {
      tl.to([contentElement, clone], {
        x: contentWidth,
        duration,
        ease: "none",
      });
    }

    animationRef.current = tl;

    // Pause on hover functionality
    if (pauseOnHover) {
      const handleMouseEnter = () => {
        animationRef.current?.pause();
      };

      const handleMouseLeave = () => {
        animationRef.current?.resume();
      };

      marqueeElement.addEventListener("mouseenter", handleMouseEnter);
      marqueeElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        marqueeElement.removeEventListener("mouseenter", handleMouseEnter);
        marqueeElement.removeEventListener("mouseleave", handleMouseLeave);
        animationRef.current?.kill();
      };
    }

    return () => {
      animationRef.current?.kill();
    };
  }, [speed, direction, pauseOnHover]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={marqueeRef} className="flex">
        <div ref={contentRef} className="flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
