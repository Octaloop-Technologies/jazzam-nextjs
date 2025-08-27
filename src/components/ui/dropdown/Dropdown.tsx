"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  dropDownClass?: string;
  gap?: 0 | 6 | 10 | 20;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  position = "bottom-right",
  gap = 6,
  className = "",
  dropDownClass = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const gapClasses = {
    0: "gap-0",
    6: "gap-[6px]",
    10: "gap-[10px]",
    20: "gap-[20px]",
  };

  // ==========================================================
  // Calculate optimal position to prevent cutoff
  // ==========================================================
  const calculatePosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top: number;
    let left: number;

    // Calculate vertical position
    if (position.includes("bottom")) {
      // Try bottom first
      if (triggerRect.bottom + dropdownRect.height + 20 <= viewportHeight) {
        top = triggerRect.bottom + 8;
      } else {
        // Fallback to top if bottom doesn't fit
        top = triggerRect.top - dropdownRect.height - 8;
      }
    } else {
      // Try top first
      if (triggerRect.top - dropdownRect.height - 20 >= 0) {
        top = triggerRect.top - dropdownRect.height - 8;
      } else {
        // Fallback to bottom if top doesn't fit
        top = triggerRect.bottom + 8;
      }
    }

    // Calculate horizontal position - align dropdown to the right side of the trigger
    if (position.includes("left")) {
      // For left positioning, align right edge of dropdown with right edge of trigger
      left = triggerRect.right - dropdownRect.width;
    } else {
      // For right positioning (default), align left edge of dropdown with right edge of trigger
      left = triggerRect.right;
    }

    // Ensure dropdown stays within viewport bounds
    if (left < 8) {
      left = 8; // Minimum left margin
    } else if (left + dropdownRect.width > viewportWidth - 8) {
      left = viewportWidth - dropdownRect.width - 8; // Maximum right margin
    }

    // Ensure vertical position stays within viewport bounds
    top = Math.max(8, Math.min(top, viewportHeight - dropdownRect.height - 8));

    setDropdownStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
    });
  };

  // ==========================================================
  // Toggle dropdown
  // ==========================================================
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Calculate position after opening
    if (newIsOpen) {
      setTimeout(() => {
        calculatePosition();
      }, 0);
    }
  };

  // ==========================================================
  // Close dropdown when clicking outside
  // ==========================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the dropdown and the trigger
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
      const isOutsideTrigger =
        triggerRef.current && !triggerRef.current.contains(event.target as Node);

      if (isOutsideDropdown && isOutsideTrigger) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ==========================================================
  // Handle window resize
  // ==========================================================
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // ==========================================================
  // Render dropdown content using portal to avoid overflow issues
  // ==========================================================
  const renderDropdownContent = () => {
    if (!isOpen) return null;

    const dropdownContent = (
      <div
        ref={dropdownRef}
        className={`dropdown-portal p-2.5 bg-white border border-gray-b rounded-3xl ${dropDownClass}`}
        style={{
          ...dropdownStyle,
          animationDuration: "0.15s",
          boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className={`w-full flex flex-col ${gapClasses[gap]}`}>{children}</div>
      </div>
    );

    // Use portal to render outside of any overflow containers
    if (typeof window !== "undefined") {
      return createPortal(dropdownContent, document.body);
    }

    return dropdownContent;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger element */}
      <div ref={triggerRef} onClick={toggleDropdown} className="cursor-pointer">
        {trigger || <MenuDotsTrigger isOpen={isOpen} />}
      </div>

      {/* Dropdown content rendered via portal */}
      {renderDropdownContent()}
    </div>
  );
};

// ==========================================================
// Dropdown item component for consistent styling
// ==========================================================
export const DropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({ children, onClick, icon, className = "" }) => {
  return (
    <div
      className={`w-full text-left text-[14px] text-text flex items-center ${className}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </div>
  );
};

export default Dropdown;

// ==========================================================
// Menu dots trigger component
// ==========================================================
const MenuDotsTrigger = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`w-8 h-8 flex-center rounded-full group 
        ${isOpen ? "bg-white/[.05]" : "hover:bg-white/[.05]"}`}
    >
      <svg
        width="16"
        height="4"
        viewBox="0 0 16 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`text-white opacity-70 group-hover:opacity-100`}
      >
        <circle cx="2" cy="2" r="2" fill="currentColor" />
        <circle cx="8" cy="2" r="2" fill="currentColor" />
        <circle cx="14" cy="2" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};
