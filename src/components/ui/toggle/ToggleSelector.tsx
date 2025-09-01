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
    <div className={`flex gap-3.5 ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;

        return (
          <button
            key={option.id}
            onClick={() => onSelectionChange(option.value)}
            className={`
              flex-between gap-2 w-[140px] py-2.5 px-2 rounded-4xl border transition-all duration-200
              ${isSelected ? "border-pri bg-white" : "border-gray-b bg-white hover:border-pri"}
            `}
          >
            <div className="flex-center gap-2">
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
                <div className={`${isSelected ? "text-pri" : "text-gray-250"}`}>{option.icon}</div>
              )}

              <span className="text-sm">{option.label}</span>
            </div>

            {isSelected && <div className="w-2 h-2 bg-pri rounded-full" />}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleSelector;
