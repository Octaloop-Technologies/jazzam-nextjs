"use client";

import React, { useState, useRef, useEffect } from "react";

export interface TabOption {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabSwitcherProps {
  options: TabOption[];
  defaultTab?: string;
  className?: string;
  contentClassName?: string;
}

const AdvanceTabSwitcher: React.FC<TabSwitcherProps> = ({
  options,
  defaultTab,
  className = "",
  contentClassName = "bg-white/10 p-4 rounded-lg",
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || (options.length > 0 ? options[0].id : "")
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getActiveContent = () => {
    const activeOption = options.find((option) => option.id === activeTab);
    return activeOption ? activeOption.content : null;
  };

  const getActiveTabLabel = () => {
    const activeOption = options.find((option) => option.id === activeTab);
    return activeOption ? activeOption.label : "";
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Custom mobile dropdown */}
      <div ref={dropdownRef} className="mb-4 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-200 flex justify-between items-center focus:outline-none shadow-sm ${
            dropdownOpen
              ? "bg-pri text-white border-pri"
              : "bg-white/10 text-white border-white/20 hover:bg-white/15"
          }`}
        >
          <span className="font-medium">{getActiveTabLabel()}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div
            className="absolute z-10 mt-1 w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg overflow-hidden opacity-0 transform transition-all duration-200"
            style={{ opacity: 1, transform: "translateY(0)" }}
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setActiveTab(option.id);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === option.id ? "bg-pri text-white" : "text-white hover:bg-white/15"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={contentClassName}>{getActiveContent()}</div>
    </div>
  );
};

export default AdvanceTabSwitcher;
