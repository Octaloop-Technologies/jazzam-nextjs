import React, { useState, useRef, useEffect } from "react";

interface DropdownProps<T> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  activeOptionClassName?: string;
  width?: string;
  renderOption?: (option: T) => React.ReactNode;
  renderValue?: (value: T) => React.ReactNode;
}

const SimpleDropdown = <T extends string>({
  value,
  options,
  onChange,
  className = "",
  buttonClassName = "",
  optionsClassName = "",
  optionClassName = "",
  activeOptionClassName = "bg-pri/20 text-white",
  width = "w-full sm:w-40",
  renderOption = (option) => option,
  renderValue = (value) => value,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between ${width} px-3 py-2 border border-white/10 rounded-md text-white hover:bg-white/10 transition-all duration-200 ${buttonClassName}`}
      >
        <span>{renderValue(value)}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 mt-1 ${width} bg-[#212121] rounded-md shadow-lg z-10 overflow-hidden ${optionsClassName}`}
        >
          {options.map((option) => (
            <button
              key={String(option)}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 text-left w-full hover:bg-white/10 ${
                value === option ? activeOptionClassName : "text-gray-300"
              } ${optionClassName}`}
            >
              {renderOption(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleDropdown;
