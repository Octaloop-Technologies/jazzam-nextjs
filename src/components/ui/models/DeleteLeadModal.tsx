"use client";

import React from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import { DeleteSvg } from "../../svgs/LeadsAnalysisSvgs";

interface DeleteLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  language?: any
}

const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  language
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000000a] backdrop-blur-[2px]"
      onClick={handleOutsideClick}
    >
      <div className="bg-white pt-[30px] p-5 rounded-3xl max-w-[458px] w-full text-center shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]">
        <div className="flex justify-center mb-4">
          <TrashSvg />
        </div>
        <h2 className="text-[18px] font-[500] leading-none mb-1">{language?.deleteLeadHeading}</h2>
        <p className="text-gray-200 mb-8 leading-none">
          {language?.deleteLeadDesc}
        </p>
        <div className="flex justify-around space-x-5">
          <PrimaryButton
            onClick={onClose}
            bordered
            className="w-full h-[50px] !gap-2.5 rounded-xl-2"
            title="Cancel"
            titleClass="font-[500]"
            iconRight={<CloseSvg />}
            disabled={isLoading}
          />

          <PrimaryButton
            onClick={handleConfirm}
            className="w-full h-[50px] !gap-2.5 rounded-xl-2"
            title={isLoading ? "Deleting..." : "Delete now"}
            titleClass="font-[500]"
            iconRight={<DeleteSvg className="size-4.5" />}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteLeadModal;

// ======================================================
// Svgs
// ======================================================
const CloseSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
      <path
        d="M0.998535 11.5L11.0014 1.5M0.998535 1.5L11.0014 11.5"
        stroke="#15803C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const TrashSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90" fill="none">
      <path
        d="M15.924 43.1827V86.7927L28.6436 63.1707L41.3632 86.7927V43.1827L61.3511 34.0973L28.6436 28.6461L12.2898 32.2802L5.02148 55.9023L15.924 46.8169M37.729 19.5607L28.6436 25.0119L19.5582 19.5607V8.65816L28.6436 3.20691L37.729 8.65816V19.5607ZM79.5219 86.7927H61.3511L55.8998 61.3536H84.9732L79.5219 86.7927Z"
        fill="white"
      />
      <path
        d="M37.7299 19.5608V8.65828L28.6445 3.20703V25.012L37.7299 19.5608ZM41.3641 86.7929V43.1829L61.352 34.0974L28.6445 28.6462V63.1708L41.3641 86.7929ZM70.4375 86.7929H79.5229L84.9741 61.3537H70.4375V86.7929Z"
        fill="#0FB981"
      />
      <path
        d="M15.924 43.1827V86.7927L28.6436 63.1707L41.3632 86.7927V43.1827L61.3511 34.0973L28.6436 28.6461L12.2898 32.2802L5.02148 55.9023L15.924 46.8169M79.5219 86.7927H61.3511L55.8998 61.3536H84.9732L79.5219 86.7927ZM37.729 19.5607L28.6436 25.0119L19.5582 19.5607V8.65816L28.6436 3.20691L37.729 8.65816V19.5607Z"
        stroke="#15803C"
        strokeWidth="3.70833"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M64.9831 45.0003L63.166 46.8173L64.9831 48.6344M64.9831 45.0003L66.8002 46.8173L64.9831 48.6344M77.7027 37.7319L75.8856 39.549L77.7027 41.3661M77.7027 37.7319L79.5198 39.549L77.7027 41.3661"
        stroke="#15803C"
        strokeWidth="3.70833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
