"use client";

import React, { useState, useRef, useCallback, forwardRef, useId } from "react";

interface RichTextEditorProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelClass?: string;
  editorClass?: string;
  wrapperClass?: string;
  minHeight?: string;
  disabled?: boolean;
  id?: string;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      placeholder = "Write your message here...",
      value = "",
      onChange,
      labelClass = "",
      editorClass = "",
      wrapperClass = "",
      minHeight = "120px",
      disabled = false,
      id,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const editorId = id || `editor-${generatedId}`;

    const executeCommand = useCallback(
      (command: string, value?: string) => {
        if (disabled) return;

        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        // Modern approach using Selection API
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        if (command === "bold" || command === "italic" || command === "underline") {
          const tag = command === "bold" ? "b" : command === "italic" ? "i" : "u";
          const element = document.createElement(tag);

          try {
            if (range.collapsed) {
              // No text selected, just insert the tag
              element.textContent = "\u200B"; // Zero-width space
              range.insertNode(element);
              range.setStart(element, 0);
              range.setEnd(element, 1);
            } else {
              // Text is selected, wrap it
              element.appendChild(range.extractContents());
              range.insertNode(element);
            }
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            // Fallback to execCommand for complex cases
            document.execCommand(command, false, value);
          }
        } else {
          // For other commands, still use execCommand
          document.execCommand(command, false, value);
        }

        // Trigger onChange with updated content
        setTimeout(() => {
          if (onChange && editor) {
            onChange(editor.innerHTML);
          }
        }, 0);
      },
      [disabled, onChange]
    );

    const handleInput = useCallback(
      (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (onChange && target) {
          onChange(target.innerHTML);
        }
      },
      [onChange]
    );

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const isCommandActive = (command: string): boolean => {
      if (!editorRef.current?.contains(document.activeElement)) return false;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      let element: HTMLElement | null = range.commonAncestorContainer as HTMLElement;

      // If it's a text node, get the parent element
      if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
      }

      // Check if the element or its parents have the formatting
      while (element && element !== editorRef.current) {
        switch (command) {
          case "bold":
            if (
              element.tagName === "B" ||
              element.tagName === "STRONG" ||
              element.style.fontWeight === "bold" ||
              window.getComputedStyle(element).fontWeight === "bold"
            ) {
              return true;
            }
            break;
          case "italic":
            if (
              element.tagName === "I" ||
              element.tagName === "EM" ||
              element.style.fontStyle === "italic" ||
              window.getComputedStyle(element).fontStyle === "italic"
            ) {
              return true;
            }
            break;
          case "underline":
            if (
              element.tagName === "U" ||
              element.style.textDecoration?.includes("underline") ||
              window.getComputedStyle(element).textDecoration?.includes("underline")
            ) {
              return true;
            }
            break;
        }
        element = element.parentElement;
      }

      return false;
    };

    const ToolbarButton = ({
      onClick,
      active = false,
      children,
      title,
    }: {
      onClick: () => void;
      active?: boolean;
      children: React.ReactNode;
      title: string;
    }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`
        w-8 h-8 flex items-center justify-center rounded-md transition-colors
        hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
        ${active ? "bg-pri text-white hover:bg-pri/90" : "text-gray-600"}
      `}
      >
        {children}
      </button>
    );

    return (
      <div className={`w-full ${wrapperClass}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={editorId}
            className={`block mb-2 font-[500] text-text text-[14px] ${labelClass}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Editor Container */}
        <div
          className={`
          relative rounded-lg overflow-hidden transition-all duration-200
          ${error ? "border-danger" : isFocused ? "border-pri ring-1 ring-pri" : "border-gray-b"}
          ${disabled ? "bg-gray-100" : "bg-white"}
          ${editorClass}
        `}
        >
          {/* Editor Content Area */}
          <div className="relative">
            <div
              ref={ref || editorRef}
              id={editorId}
              contentEditable={!disabled}
              className={`
                w-full p-4 outline-none font-[400] text-[16px] leading-relaxed
                disabled:cursor-not-allowed min-h-[100px]
                ${disabled ? "text-gray-400 bg-gray-100" : "text-text bg-bg"}
                focus:outline-none
              `}
              style={{ minHeight }}
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              suppressContentEditableWarning={true}
              data-placeholder={placeholder}
            />

            {/* Placeholder */}
            {!value && !isFocused && (
              <div className="absolute top-4 left-4 text-placeholder pointer-events-none text-[16px] leading-relaxed">
                {placeholder}
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 p-3 bg-bg border-b border-gray-b/30">
            <ToolbarButton
              onClick={() => executeCommand("bold")}
              active={isCommandActive("bold")}
              title="Bold"
            >
              <span className="font-bold text-sm">B</span>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("italic")}
              active={isCommandActive("italic")}
              title="Italic"
            >
              <span className="italic text-sm">I</span>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("underline")}
              active={isCommandActive("underline")}
              title="Underline"
            >
              <span className="underline text-sm">U</span>
            </ToolbarButton>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => executeCommand("insertUnorderedList")}
              active={isCommandActive("insertUnorderedList")}
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("insertOrderedList")}
              active={isCommandActive("insertOrderedList")}
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => executeCommand("justifyLeft")}
              active={isCommandActive("justifyLeft")}
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("justifyCenter")}
              active={isCommandActive("justifyCenter")}
              title="Align Center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("justifyRight")}
              active={isCommandActive("justifyRight")}
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => executeCommand("createLink", prompt("Enter URL:") || "")}
              active={isCommandActive("createLink")}
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("insertImage", prompt("Enter image URL:") || "")}
              title="Insert Image"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </ToolbarButton>
          </div>
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

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
