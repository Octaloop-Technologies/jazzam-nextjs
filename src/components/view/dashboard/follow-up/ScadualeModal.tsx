"use client";

import React, { useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";

interface ScadualeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  title?: string;
}

const ScadualeModal: React.FC<ScadualeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Schedule Follow-up",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000000a] backdrop-blur-[2px]"
      onClick={handleOutsideClick}
    >
      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title={title}
        className="max-w-[500px] w-full mx-4"
      />
    </div>
  );
};

export default ScadualeModal;
