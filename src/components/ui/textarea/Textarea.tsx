"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  textareaSize?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "filled";
  labelClass?: string;
  textareaClass?: string;
  wrapperClass?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      textareaSize = "md",
      variant = "default",
      labelClass = "",
      textareaClass = "",
      wrapperClass = "",
      resize = "vertical",
      className = "",
      disabled = false,
      placeholder,
      rows = 4,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Size classes
    const sizeClasses = {
      sm: "min-h-[80px] px-3 py-2 text-[14px]",
      md: "min-h-[100px] px-4 py-3 text-[16px]",
      lg: "min-h-[120px] px-5 py-4 text-[18px]",
    };

    // Variant classes
    const variantClasses = {
      default: "bg-white border border-gray-b",
      outlined: "bg-transparent border border-gray-b",
      filled: "bg-gray-50 border border-transparent",
    };

    // Label size classes
    const labelSizeClasses = {
      sm: "text-[13px]",
      md: "text-[14px]",
      lg: "text-[15px]",
    };

    // Resize classes
    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const baseTextareaClasses = `
    w-full
    rounded-[12px]
    outline-none
    transition-all
    duration-200
    font-[400]
    placeholder:text-placeholder/50
    placeholder:capitalize
    disabled:bg-gray-100
    disabled:cursor-not-allowed
    disabled:text-gray-400
    focus:ring-1
    ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-pri focus:border-pri"}
    ${disabled ? "bg-gray-100 text-gray-400" : "text-text"}
    ${sizeClasses[textareaSize]}
    ${variantClasses[variant]}
    ${resizeClasses[resize]}
    ${textareaClass}
    ${className}
  `;

    return (
      <div className={`w-full ${wrapperClass}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={`block mb-2 font-[500] text-text ${labelSizeClasses[textareaSize]} ${labelClass}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea Field */}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          className={baseTextareaClasses}
          {...props}
        />

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

Textarea.displayName = "Textarea";

export default Textarea;
