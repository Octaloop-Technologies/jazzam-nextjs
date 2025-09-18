"use client";

import { useGSAP } from "@gsap/react";
import React, { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ======================================================
// Register GSAP plugins
// ======================================================
gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, className = "" }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // ======================================================
  // Toggle item with animation
  // ======================================================
  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    const isCurrentlyOpen = newOpenItems.has(id);

    if (isCurrentlyOpen) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);

    // Add smooth animation on toggle
    const faqItem = document.querySelector(`[data-faq-id="${id}"]`);
    if (faqItem) {
      if (!isCurrentlyOpen) {
        // Opening animation - simplified for better performance
        gsap.to(faqItem, {
          scale: 1.01,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      } else {
        // Closing animation - reset to normal
        gsap.to(faqItem, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    }
  };

  // ======================================================
  // Animation : faq appear alternating from right and left sides on scroll
  // ======================================================
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const faqItems = document.querySelectorAll(".faq-item");

      // Set initial state for all items
      gsap.set(faqItems, {
        opacity: 0,
        y: 50,
      });

      // Animate each item with alternating direction on scroll
      faqItems.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const startX = isEven ? 80 : -80; // Even items from right, odd from left

        gsap.fromTo(
          item,
          {
            x: startX,
            opacity: 0,
            y: 30,
          },
          {
            x: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
  }, [items]);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        return (
          <div
            key={item.id}
            data-faq-id={item.id}
            className="faq-item bg-white rounded-3xl-2 border border-gray-b transition-all duration-300 hover:shadow-sm relative"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full p-[40px] text-left flex items-center justify-between max-xs:p-5"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="absolute left-0 top-1/2 translate-x-[-50%] -translate-y-1/2 flex items-center justify-center size-[40px] max-xs:size-[30px] rounded-full bg-pri text-white text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <h3 className="text-[16px] font-[500] text-left">{item.question}</h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`size-[24px] max-xs:size-[20px] transition-transform duration-200 ease-out ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  <path
                    d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                    stroke="#98A2B3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
            <div
              id={`faq-answer-${item.id}`}
              className={`transition-all duration-300 ease-out overflow-hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-5 px-[40px] max-xs:px-5">
                <div
                  className={`w-full h-0.5 bg-gradient-to-r from-pri to-blue-500 mb-4 transition-all duration-300 ${
                    isOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                ></div>
                <p
                  className={`text-[14px] font-[400] text-[#666666] leading-relaxed transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
