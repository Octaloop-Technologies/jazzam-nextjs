"use client";

import React, { useState, useEffect } from "react";

interface VerificationCodeFieldProps {
  id: string;
  label?: string;
  maxLength?: number;
  className?: string;
  wrapperClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelClass?: string;
  error?: string;
}

const VerificationCodeField: React.FC<VerificationCodeFieldProps> = ({
  id,
  label = "Verification Code",
  maxLength = 6,
  className = "h-[48px]",
  wrapperClassName = "w-full",
  value = "",
  onChange,
  labelClass = "text-[16px]",
  error,
}) => {
  const [code, setCode] = useState<string>(value);

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const inputValue = e.target.value.replace(/[^0-9]/g, "");

    // Limit to maxLength
    const trimmedValue = inputValue.slice(0, maxLength);

    setCode(trimmedValue);

    if (onChange) {
      onChange(trimmedValue);
    }
  };

  return (
    <div className={wrapperClassName}>
      {/* -- Label -- */}
      {label && (
        <label htmlFor={id} className={`block mb-1.5 w-fit ${labelClass}`}>
          {label}
        </label>
      )}

      {/* -- Input Container -- */}
      <div className="relative w-full">
        <input
          type="text"
          inputMode="numeric"
          id={id}
          className={`w-full px-4 text-[16px] text-center tracking-widest font-mono text-text bg-light rounded-[12px] 
            outline-none 
            placeholder:text-placeholder/[.5] placeholder:capitalize 
            focus:ring-1
            ${error ? "focus:ring-red-500" : "focus:ring-pri"} 
            ${className}`}
          placeholder="• • • • • •"
          value={code}
          onChange={handleChange}
          maxLength={maxLength}
        />
      </div>

      {/* -- Error Message -- */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VerificationCodeField;
