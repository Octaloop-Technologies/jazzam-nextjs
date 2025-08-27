"use client";

import { useState } from "react";
import { ToggleOption, ToggleSelector } from "@/components/ui/toggle";

const LanguageToggle = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");

  const languageOptions: ToggleOption[] = [
    {
      id: "english",
      label: "English",
      value: "english",
      img: "/assets/images/flags/uk-flag.svg",
    },
    {
      id: "arabic",
      label: "Arabic",
      value: "arabic",
      img: "/assets/images/flags/arabic.svg",
    },
  ];

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    console.log("Selected language:", value);
  };

  return (
    <ToggleSelector
      options={languageOptions}
      selectedValue={selectedLanguage}
      onSelectionChange={handleLanguageChange}
    />
  );
};

export default LanguageToggle;
