"use client";

import React, { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";
import { EyeIcon, EyeSlashIcon, SearchIcon, FileIcon } from "@/components/svgs/inputIcons";

export interface InputFieldProps {
  id: string;
  label?: string;
  type: string;
  placeholder?: string;
  buttonText?: string;
  icon?: "search" | "file";
  disabled?: boolean;
  wrapperClassName?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  labelClass?: string;
  error?: string;
  passwordIconClass?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  buttonText,
  icon,
  disabled = false,
  wrapperClassName = "w-full",
  value,
  onChange,
  onBlur,
  labelClass = "text-[16px]",
  error,
  passwordIconClass = "text-pri",
  name,
  required = false,
  autoComplete,
  onKeyDown,
  onFocus,
  autoFocus = false,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className={`block mb-1.5 w-fit ${labelClass}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <input
          type={type === "password" && showPassword ? "text" : type}
          id={id}
          name={name || id}
          className={`w-full px-4 text-[16px] text-text bg-light rounded-[12px] 
              focus:outline-none focus:ring-1 focus:ring-pri
              ${error ? "!border-red-500" : "border-0"}
              ${
                type === "password"
                  ? "py-[16.5px] pr-[50px]"
                  : icon
                  ? "py-[16.5px] pl-[50px]"
                  : "py-[16.5px]"
              }
              ${disabled ? "opacity-30 cursor-not-allowed" : ""}
              ${className}
            `}
          placeholder={placeholder}
          value={type === "button" ? buttonText : value}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          readOnly={type === "button"}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {icon === "search" && (
          <div className="icon absolute left-[20px] top-1/2 -translate-y-1/2 cursor-pointer">
            <SearchIcon className="size-4" />
          </div>
        )}

        {icon === "file" && (
          <div className="icon absolute left-[20px] top-1/2 -translate-y-1/2 cursor-pointer">
            <FileIcon className="size-4" />
          </div>
        )}

        {type === "password" && (
          <div
            className={`icon absolute right-[20px] top-1/2 -translate-y-1/2 cursor-pointer ${passwordIconClass}`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1 text-left text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
