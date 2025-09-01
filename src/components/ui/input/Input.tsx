"use client";

import React, { forwardRef, InputHTMLAttributes, useId } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  variant?: "default" | "background" | "outlined" | "filled";
  labelClass?: string;
  inputClass?: string;
  wrapperClass?: string;
  iconWrapperClass?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      leftIcon,
      rightIcon,
      inputSize = "md",
      variant = "default",
      labelClass = "",
      inputClass = "",
      wrapperClass = "",
      iconWrapperClass = "",
      className = "",
      disabled = false,
      type = "text",
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;

    // Size classes
    const sizeClasses = {
      sm: "h-[40px] px-3 text-[14px]",
      md: "h-[48px] px-4 text-[16px]",
      lg: "h-[56px] px-5 text-[18px]",
    };

    // Variant classes
    const variantClasses = {
      default: "bg-white border border-gray-b",
      background: "bg-bg",
      outlined: "bg-transparent border border-gray-b",
      filled: "bg-gray-50 border border-transparent",
    };

    // Label size classes
    const labelSizeClasses = {
      sm: "text-[13px]",
      md: "text-[14px]",
      lg: "text-[15px]",
    };

    // Icon size classes
    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const baseInputClasses = `
    w-full
    rounded-lg
    outline-none
    transition-all
    duration-200
    font-[400]
    placeholder:text-placeholder
    placeholder:capitalize
    disabled:bg-gray-100
    disabled:cursor-not-allowed
    disabled:text-gray-400
    focus:ring-1
    ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-pri focus:border-pri"}
    ${disabled ? "bg-gray-100 text-gray-400" : "text-text"}
    ${leftIcon ? "pl-10" : ""}
    ${rightIcon ? "pr-10" : ""}
    ${sizeClasses[inputSize]}
    ${variantClasses[variant]}
    ${inputClass}
    ${className}
  `;

    return (
      <div className={`w-full ${wrapperClass}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`block mb-2 font-[500] text-text ${labelSizeClasses[inputSize]} ${labelClass}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-n ${iconWrapperClass}`}
            >
              <div className={iconSizeClasses[inputSize]}>{leftIcon}</div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled}
            placeholder={placeholder}
            className={baseInputClasses}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-n ${iconWrapperClass}`}
            >
              <div className={iconSizeClasses[inputSize]}>{rightIcon}</div>
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {(error || helperText) && (
          <p className={`mt-1.5 text-[13px] ${error ? "text-red-500" : "text-gray-n"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
