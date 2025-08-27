"use client";

import React, { useState, useEffect } from "react";

interface CheckBoxCompProps {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  error?: string;
}

const CheckBoxComp: React.FC<CheckBoxCompProps> = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
  labelClassName = "ml-2 text-text text-[12px] leading-[20px]",
  wrapperClassName = "flex items-center mb-2",
  error,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = e.target.checked;
    setIsChecked(newCheckedState);
    onChange?.(newCheckedState);
  };

  return (
    <div className={`${wrapperClassName}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          className={`appearance-none w-[13px] h-[13px] bg-[#E0E0E0] rounded-full 
            checked:bg-black focus:outline-none focus:ring-2 
            focus:ring-black/30 cursor-pointer transition-all duration-200 
            ${className}`}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="absolute pointer-events-none transition-opacity duration-200">
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="text-white w-[13px] h-[13px]"
            >
              <path
                fill="currentColor"
                d="m10 15.17l9.192-9.191l1.414 1.414L10 17.999l-6.364-6.364l1.414-1.414z"
              ></path>
            </svg>
          )}
        </div>

        {label && (
          <label
            htmlFor={id}
            className={`${labelClassName} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {label}
          </label>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CheckBoxComp;
