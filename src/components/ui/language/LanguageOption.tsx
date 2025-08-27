"use client";

import React from "react";
import OptimizedImage from "../image/OptimizedImage";

interface LanguageOptionProps {
  flag: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({
  flag,
  name,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Flag icon */}
        <div className="size-[50px] rounded-full overflow-hidden flex-shrink-0">
          {flag.endsWith(".svg") ? (
            <OptimizedImage
              src={flag}
              alt={`${name} flag`}
              fill
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              {name.charAt(0)}
            </div>
          )}
        </div>

        {/* Language name */}
        <span className="text-gray-900 text-[16px] font-medium">{name}</span>
      </div>

      {/* Selection indicator */}
      <div className="flex-shrink-0">
        <div
          className={`size-[24px] rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-sec" : "border-gray-300"
          }`}
        >
          {isSelected && <div className="size-[12px] rounded-full bg-sec" />}
        </div>
      </div>
    </div>
  );
};

export default LanguageOption;
