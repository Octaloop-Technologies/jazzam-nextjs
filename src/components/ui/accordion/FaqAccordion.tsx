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
            className="bg-white rounded-2xl border border-gray-150 overflow-hidden transition-all duration-300 hover:shadow-sm"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pri/20 focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pri text-white text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <h3 className="text-[16px] font-[600] text-left">{item.question}</h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div
              id={`faq-answer-${item.id}`}
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5 pl-[72px]">
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
