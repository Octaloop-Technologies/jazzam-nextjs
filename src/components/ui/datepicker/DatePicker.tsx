"use client";

import React, { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import CloseSvg from "@/components/svgs/CloseSvg";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  onCancel,
  onConfirm,
  title = "Schedule Follow-up",
  className = "",
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // helper to compare only date portion
  const isBeforeToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  };

  const canNavigatePrev = () => {
    const today = new Date();
    const cmYear = currentMonth.getFullYear();
    const cmMonth = currentMonth.getMonth();
    const tYear = today.getFullYear();
    const tMonth = today.getMonth();
    return cmYear > tYear || (cmYear === tYear && cmMonth > tMonth);
  };

  const handleDateClick = (date: Date) => {
    if (isBeforeToday(date)) return;
    onDateSelect(date);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Pick Any Date";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      year: "numeric",
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // use today's date when selectedDate prop is null
  const displayedDate = selectedDate ?? new Date();

  const isSelected = (date: Date) => {
    return date.toDateString() === displayedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg ${className}`}>
      <h2 className="text-[16px] font-[500] pb-1 border-b border-gray-n/30">{title}</h2>

      {/* Calendar */}
      <div className="mb-6">
        {/* Calendar Navigation */}

        <div className="mt-4 flex-between">
          <span className="text-sm font-medium">
            {formatDate(displayedDate)}
          </span>

          <div className="flex items-center gap-2 justify-between">
            <button
              onClick={() => canNavigatePrev() && navigateMonth("prev")}
              disabled={!canNavigatePrev()}
              className={`size-[30px] rounded-full flex-center transition-colors text-gray-250 ${
                !canNavigatePrev() ? "opacity-50 cursor-not-allowed" : "hover:bg-pri hover:text-white"
              }`}
            >
              <svg className="size-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-medium">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => navigateMonth("next")}
              className="size-[30px] hover:bg-pri rounded-full flex-center transition-colors hover:text-white text-gray-250"
            >
              <svg className="size-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2 mt-2">
          {daysInWeek.map((day, index) => (
            <div key={index} className="text-center text-sm text-pri">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, isCurrentMonth }: any, index) => {
            const disabled = isBeforeToday(date);
            const baseClasses = `
                  flex-center rounded-full transition-colors text-sm py-2
                `;
            const enabledClasses = isCurrentMonth
              ? isSelected(date)
                ? "bg-pri text-white"
                : isToday(date)
                ? "bg-pri text-white"
                : "hover:bg-pri hover:text-white text-gray-250"
              : "text-gray-250";
            const disabledClasses = "opacity-50 cursor-not-allowed text-gray-300";
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
              >
                {date?.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <PrimaryButton
          title="Cancel"
          onClick={onCancel}
          bordered
          iconRight={<CloseSvg className="size-[11px]" />}
          className="flex-1 px-4 py-3 border-2 border-pri text-pri rounded-xl font-medium hover:bg-green-50 transition-colors"
        />
        <PrimaryButton
          title="Confirm"
          onClick={onConfirm}
          className="flex-1 px-4 py-3 bg-pri text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
        />
      </div>
    </div>
  );
};

export default DatePicker;