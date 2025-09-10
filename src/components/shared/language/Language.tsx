"use client";

import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import { CheckSvg, GlobeSvg } from "@/components/svgs/NavbarSvgs";
import { languages } from "@/lib/constants/navbarConstants";
import React, { useState } from "react";

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <Dropdown
      trigger={
        <button className="flex-center gap-1 gray-hover">
          <GlobeSvg />
          <span className="uppercase text-[14px]">
            {languages.find((language) => language.code === selectedLanguage)?.code}
          </span>
        </button>
      }
      dropDownClass="w-[176px]"
      position="bottom-left"
    >
      {languages.map((language) => (
        <DropdownItem key={language.name} onClick={() => handleLanguageChange(language.code)}>
          <button
            className={`p-2.5 flex-between w-full rounded-lg transition-all duration-200 ease-in-out
              ${
                language.code === selectedLanguage
                  ? "text-sec bg-gray-100"
                  : "text-text hover:bg-gray-100"
              }`}
          >
            <h2 className={`text-[14px]`}>{language.name}</h2>
            {language.code === selectedLanguage && <CheckSvg />}
          </button>
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default Language;
