"use client";

import React, { useState } from "react";

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const daysInWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

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

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    setIsCalendarOpen(false);
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

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">{title}</h2>

      {/* Date Display Area */}
      <div className="mb-6 space-y-2">
        <div className="bg-blue-50 p-3 rounded-lg">
          <span className="text-blue-600 font-medium">
            {isToday(selectedDate || new Date()) ? "T " : ""}
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "February 2020"}
          </span>
        </div>
        <div
          className="bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <span className="text-blue-600 font-medium">{formatDate(selectedDate)}</span>
        </div>
      </div>

      {/* Calendar */}
      {isCalendarOpen && (
        <div className="mb-6">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-lg font-medium text-gray-900">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysInWeek.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-green-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, isCurrentMonth }, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  ${
                    isCurrentMonth
                      ? isSelected(date)
                        ? "bg-green-600 text-white"
                        : isToday(date)
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                      : "text-gray-400"
                  }
                `}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border-2 border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
        >
          Cancel X
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
