import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  id,
  label,
}) => {
  const sizeClasses = {
    sm: "w-10 h-5",
    md: "w-12 h-6",
    lg: "w-14 h-7",
  };

  const thumbSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex items-center justify-center
          ${sizeClasses[size]}
          rounded-full transition-all duration-200 ease-in-out
          focus:outline-none
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          ${checked ? "bg-sec" : "bg-toggle-bg"}
        `}
      >
        <span
          className={`
            absolute left-0.5 inline-block
            ${thumbSizeClasses[size]}
            bg-white rounded-full shadow-sm
            transform transition-transform duration-200 ease-in-out
            ${
              checked
                ? "translate-x-6" // Move to right for active state
                : "translate-x-0" // Stay at left for inactive state
            }
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
