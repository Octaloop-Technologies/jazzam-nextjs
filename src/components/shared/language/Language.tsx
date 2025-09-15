"use client";

import Dropdown, { DropdownItem } from "@/components/ui/dropdown/Dropdown";
import { CheckSvg, GlobeSvg } from "@/components/svgs/NavbarSvgs";

interface LanguageProps {
  languages: { code: string; label: string; flag: string }[];
  changeLang: (lang: FormData) => void;
  currentLang: string;
}

const Language = ({ languages, changeLang, currentLang }: LanguageProps) => {
  // Wrapper function to convert string to FormData
  const handleLangChange = (lang: string) => {
    const formData = new FormData();
    formData.append("lang", lang);
    changeLang(formData);
  };

  const handleLanguageChange = (language: string) => {
    handleLangChange(language);
  };

  return (
    <Dropdown
      trigger={
        <button className="flex-center gap-1 gray-hover">
          <GlobeSvg />
          <span className="uppercase text-[14px]">{currentLang}</span>
        </button>
      }
      dropDownClass="w-[176px]"
      position="bottom-left"
    >
      {languages &&
        languages.map((language) => (
          <DropdownItem key={language.code} onClick={() => handleLanguageChange(language.code)}>
            <button
              className={`p-2.5 flex-between w-full rounded-lg transition-all duration-200 ease-in-out
              ${
                language.code === currentLang
                  ? "text-sec bg-gray-100"
                  : "text-text hover:bg-gray-100"
              }`}
            >
              <h2 className={`text-[14px]`}>{language.label}</h2>
              {language.code === currentLang && <CheckSvg />}
            </button>
          </DropdownItem>
        ))}
    </Dropdown>
  );
};

export default Language;
