"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  const updatePosition = useCallback(() => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    const GAP = 8;
    let newPosition = position;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    const pos = {
      top: {
        top: targetRect.top - tooltipRect.height - GAP + scrollTop,
        left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + scrollLeft,
      },
      bottom: {
        top: targetRect.bottom + GAP + scrollTop,
        left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + scrollLeft,
      },
      left: {
        top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + scrollTop,
        left: targetRect.left - tooltipRect.width - GAP + scrollLeft,
      },
      right: {
        top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + scrollTop,
        left: targetRect.right + GAP + scrollLeft,
      },
    };

    const checks = {
      top: () => pos.top.top - scrollTop < 0,
      bottom: () => pos.bottom.top + tooltipRect.height - scrollTop > innerHeight,
      left: () => pos.left.left - scrollLeft < 0,
      right: () => pos.right.left + tooltipRect.width - scrollLeft > innerWidth,
    };

    if (checks[newPosition]()) {
      const opposites = {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      };
      newPosition = opposites[newPosition] as typeof position;
    }

    let { top, left } = pos[newPosition];

    if (newPosition === "top" || newPosition === "bottom") {
      left = Math.max(
        scrollLeft + GAP,
        Math.min(left, scrollLeft + innerWidth - tooltipRect.width - GAP)
      );
    } else {
      top = Math.max(
        scrollTop + GAP,
        Math.min(top, scrollTop + innerHeight - tooltipRect.height - GAP)
      );
    }

    setTooltipPosition({ top, left });
    setCurrentPosition(newPosition);
  }, [position]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleScroll = () => updatePosition();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isVisible, updatePosition]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const tooltipClasses = `
    fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md shadow-sm
    pointer-events-none transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}
    ${className}
  `;

  const tooltipContent =
    isVisible && portalElement
      ? createPortal(
          <div
            ref={tooltipRef}
            className={tooltipClasses}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {content}
            <div
              className={`
          absolute w-2 h-2 bg-gray-800 transform rotate-45
          ${currentPosition === "bottom" ? "-top-1 left-1/2 -translate-x-1/2" : ""}
          ${currentPosition === "top" ? "-bottom-1 left-1/2 -translate-x-1/2" : ""}
          ${currentPosition === "left" ? "top-1/2 -right-1 -translate-y-1/2" : ""}
          ${currentPosition === "right" ? "top-1/2 -left-1 -translate-y-1/2" : ""}
        `}
            />
          </div>,
          portalElement
        )
      : null;

  return (
    <div
      ref={targetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
      {tooltipContent}
    </div>
  );
};

export default Tooltip;
