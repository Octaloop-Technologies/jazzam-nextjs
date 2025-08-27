import React from "react";
import OptimizedImage from "../image/OptimizedImage";

export interface ToggleOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  img?: string;
}

interface ToggleSelectorProps {
  options: ToggleOption[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  className?: string;
}

const ToggleSelector: React.FC<ToggleSelectorProps> = ({
  options,
  selectedValue,
  onSelectionChange,
  className = "",
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;

        return (
          <button
            key={option.id}
            onClick={() => onSelectionChange(option.value)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200
              ${
                isSelected
                  ? "border-green-500 bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            {option.img && (
              <div className="w-4 h-4 relative overflow-hidden rounded-full">
                <OptimizedImage
                  src={option.img}
                  alt={option.label}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {option.icon && (
              <div className={`${isSelected ? "text-blue-500" : "text-green-500"}`}>
                {option.icon}
              </div>
            )}

            <span className="text-sm">{option.label}</span>

            {isSelected && <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleSelector;
