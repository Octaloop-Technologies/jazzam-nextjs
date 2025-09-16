"use client";

import React, { useState } from "react";

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

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        return (
          <div
            key={item.id}
            className="bg-white rounded-3xl-2 border border-gray-b transition-all duration-300 hover:shadow-sm relative"
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
                  className={`size-[24px] max-xs:size-[20px] transition-transform duration-200 ${
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
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-5 px-[40px] max-xs:px-5">
                <p className="text-[14px] font-[400] text-[#666666] leading-relaxed">
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
