"use client";

import React, { useState } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { LanguageOption } from "@/components/ui/language";
import { useLocale } from "@/lib/hooks/useLocale";
import { useI18n } from "@/providers/I18nProvider";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (languageCode: string) => void;
  currentLanguage?: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentLanguage,
}) => {
  const { setLocale: setLocalLocale } = useLocale();
  const { setLocale: setI18nLocale } = useI18n();

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || "en");

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const applyLanguage = async (code: string) => {
    // Persist and update app-level locale
    setLocalLocale(code);
    await setI18nLocale(code);

    // Update document attributes for direction and lang
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
      document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    }
  };

  const handleConfirm = async () => {
    await applyLanguage(selectedLanguage);
    onConfirm(selectedLanguage);
    onClose();
  };

  const languages = [
    { flag: "/assets/images/flags/uk-flag.svg", name: "English (UK)", value: "en" },
    { flag: "/assets/images/flags/arabic.svg", name: "Arabic", value: "ar" },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000000a] backdrop-blur-[2px]"
      onClick={handleOutsideClick}
    >
      <div className="bg-white pt-[30px] p-5 rounded-3xl max-w-[458px] w-full text-center shadow-[0_4px_20px_0_rgba(0,0,0,0.08)]">
        <h1 className="text-[20px] text-left font-[500] leading-none pb-2 border-b border-gray-n">
          Change language
        </h1>

        {/* Language options */}
        <div className="py-4 space-y-2">
          {languages.map((language) => (
            <LanguageOption
              key={language.value}
              flag={language.flag}
              name={language.name}
              isSelected={selectedLanguage === language.value}
              onClick={() => setSelectedLanguage(language.value)}
            />
          ))}
        </div>

        {/* buttons */}
        <div className="flex justify-around space-x-5">
          <PrimaryButton
            onClick={onClose}
            bordered
            className="w-full h-[50px] !gap-2.5 rounded-xl-2"
            title="Cancel"
            titleClass="font-[500]"
            iconRight={<CloseSvg />}
          />

          <PrimaryButton
            onClick={handleConfirm}
            className="w-full h-[50px] !gap-2.5 rounded-xl-2"
            title="Apply changes"
            titleClass="font-[500]"
          />
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;

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