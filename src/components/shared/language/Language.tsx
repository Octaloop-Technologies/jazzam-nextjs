"use client";

import { CheckSvg, GlobeSvg } from "@/components/svgs/NavbarSvgs";
import { useI18n } from "@/providers/I18nProvider";
import { changeLangNoReload } from "@/lib/api/main-page";

interface LanguageProps {
  languages: { code: string; label: string; flag: string }[];
  changeLang?: (lang: FormData) => void; 
  currentLang?: string;
}

const Language = ({ languages }: LanguageProps) => {
  const { lang: currentLang, setLocale } = useI18n();


  // Get the next language in the list
  const getNextLanguage = () => {
    const currentIndex = languages.findIndex(lang => lang.code === currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    return languages[nextIndex];
  };

  // Handle direct click to switch to next language
  const handleLanguageSwitch = async () => {
    const currentIndex = languages.findIndex(lang => lang.code === currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];
    
    try {
      // Update I18nProvider context first
      await setLocale(nextLanguage.code);
      
      // Save language to storage
      await changeLangNoReload(nextLanguage.code);
      
      // Reload page to apply language change
      window.location.reload();
    } catch (error) {
      console.error("Error switching language:", error);
    }
  };

  // Get current language display info
  const currentLanguageInfo = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <button 
      onClick={handleLanguageSwitch}
      className="flex items-center gap-2 gray-hover p-2 rounded-lg transition-all duration-200 ease-in-out"
      title={`Switch to ${getNextLanguage().label}`}
    >
      <GlobeSvg />
      <div className="flex items-center gap-1">
        <span className="uppercase text-[14px] font-medium">
          {currentLanguageInfo.code}
        </span>
        {/* Optional: Show small indicator that it's clickable */}
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="text-gray-500"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
        </svg>
      </div>
    </button>
  );

};

export default Language;