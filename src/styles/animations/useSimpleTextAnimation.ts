"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface SimpleTextAnimationOptions {
  titleText: string;
  paragraphText?: string;
}

export const useSimpleTextAnimation = ({
  titleText,
  paragraphText,
}: SimpleTextAnimationOptions) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!titleRef.current || !containerRef.current) return;

    // Set initial states
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });
    if (paragraphRef.current) {
      gsap.set(paragraphRef.current, {
        opacity: 0,
        y: 20,
      });
    }

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false, // Set to true for debugging
      },
    });

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate paragraph (only if it exists)
    if (paragraphRef.current) {
      tl.to(
        paragraphRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }

    // Add subtle floating animation
    tl.to(
      containerRef.current,
      {
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
      },
      "-=0.5"
    );

    // Cleanup function
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [titleText, paragraphText]);

  return {
    titleRef,
    paragraphRef,
    containerRef,
  };
};
