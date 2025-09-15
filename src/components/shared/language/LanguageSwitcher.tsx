import { changeLang, getCurrentLang } from "@/app/action";
import Language from "./Language";
import { getDictionary } from "@/lib/i18n/getDictionary";

const LanguageSwitcher = async () => {
  const currentLang = await getCurrentLang();
  const dict = await getDictionary(currentLang);

  const languages = [
    { code: "en", label: dict?.ui?.language?.en || "English", flag: "🇺🇸" },
    { code: "ar", label: dict?.ui?.language?.ar || "Arabic", flag: "🇸🇦" },
  ];

  return <Language languages={languages} changeLang={changeLang} currentLang={currentLang} />;
};

export default LanguageSwitcher;
