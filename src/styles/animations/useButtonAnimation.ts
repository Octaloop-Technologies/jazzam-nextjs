"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * A reusable hook for creating animated buttons with SVG icons and background fill effects.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const buttonRef = useRef<HTMLButtonElement | null>(null);
 *   const svgRef = useRef<SVGSVGElement | null>(null);
 *
 *   useButtonAnimation({
 *     buttonRef,
 *     svgRef,
 *     enableScrollTrigger: true,
 *     enablePulsing: true,
 *     enableRipple: true,
 *     enableBackgroundFill: true,
 *     delay: 0.5,
 *     gradientColors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
 *   });
 *
 *   return (
 *     <button ref={buttonRef}>
 *       Click me
 *       <svg ref={svgRef}>...</svg>
 *     </button>
 *   );
 * };
 * ```
 */

interface ButtonAnimationOptions {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  enableScrollTrigger?: boolean;
  enablePulsing?: boolean;
  enableRipple?: boolean;
  enableBackgroundFill?: boolean;
  scrollTriggerStart?: string;
  scrollTriggerEnd?: string;
  delay?: number;
  gradientColors?: string[];
}

export const useButtonAnimation = ({
  buttonRef,
  svgRef,
  enableScrollTrigger = true,
  enablePulsing = true,
  enableRipple = true,
  enableBackgroundFill = true,
  scrollTriggerStart = "top 90%",
  scrollTriggerEnd = "bottom 10%",
  delay = 0,
  gradientColors = ["#FFD700", "#FFA500", "#FF8C00"],
}: ButtonAnimationOptions) => {
  const fillElementRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!buttonRef.current || !svgRef.current) return;

    const buttonElement = buttonRef.current;
    const svgElement = svgRef.current;

    // Create background fill element if enabled
    if (enableBackgroundFill) {
      const fillElement = document.createElement("div");
      fillElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, ${gradientColors.join(", ")});
        border-radius: inherit;
        opacity: 0;
        z-index: -1;
        transition: opacity 0.3s ease;
      `;
      buttonElement.appendChild(fillElement);
      fillElementRef.current = fillElement;
    }

    // Set initial states
    gsap.set(buttonElement, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    gsap.set(svgElement, {
      scale: 1,
      rotation: 0,
    });

    // Entry animation
    const entryAnimation = gsap.to(buttonElement, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      delay,
    });

    // Add ScrollTrigger if enabled
    if (enableScrollTrigger) {
      ScrollTrigger.create({
        trigger: buttonElement,
        start: scrollTriggerStart,
        end: scrollTriggerEnd,
        toggleActions: "play none none reverse",
        animation: entryAnimation,
      });
    }

    // Hover animations
    const handleMouseEnter = () => {
      // Button animation
      gsap.to(buttonElement, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });

      // SVG rotation and scale animation
      gsap.to(svgElement, {
        scale: 1.2,
        rotation: 45,
        duration: 0.4,
        ease: "back.out(1.7)",
      });

      // Background fill animation
      if (enableBackgroundFill && fillElementRef.current) {
        gsap.to(fillElementRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Ripple effect
      if (enableRipple) {
        const ripple = document.createElement("div");
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        `;
        buttonElement.appendChild(ripple);

        gsap.to(ripple, {
          width: "200px",
          height: "200px",
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            ripple.remove();
          },
        });
      }
    };

    const handleMouseLeave = () => {
      // Button animation
      gsap.to(buttonElement, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // SVG return animation
      gsap.to(svgElement, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // Background fill fade out
      if (enableBackgroundFill && fillElementRef.current) {
        gsap.to(fillElementRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    // Add event listeners
    buttonElement.addEventListener("mouseenter", handleMouseEnter);
    buttonElement.addEventListener("mouseleave", handleMouseLeave);

    // Pulsing effect for SVG
    if (enablePulsing) {
      gsap.to(svgElement, {
        scale: 1.1,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // Add a subtle pulsing glow to the button
    gsap.to(buttonElement, {
      boxShadow: "0 0 20px rgba(238, 182, 0, 0.3)",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Cleanup function
    return () => {
      buttonElement.removeEventListener("mouseenter", handleMouseEnter);
      buttonElement.removeEventListener("mouseleave", handleMouseLeave);
      if (fillElementRef.current) {
        fillElementRef.current.remove();
      }
    };
  }, [delay, enableScrollTrigger, enablePulsing, enableRipple, enableBackgroundFill]);

  return {
    fillElementRef,
  };
};
