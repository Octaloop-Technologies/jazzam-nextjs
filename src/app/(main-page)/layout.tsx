import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCurrentLang } from "../action";
import HomeNavbar from "./HomeNavbar";
import HomeFooter from "./HomeFooter";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const lang = await getCurrentLang();
  const dict = await getDictionary(lang);

  return (
    <div className="w-full bg-white min-h-dvh flex flex-col">
      <HomeNavbar dict={dict} currentLang={lang} />
      <main className="flex-1">{children}</main>
      <HomeFooter dict={dict} />
    </div>
  );
};

export default HomeLayout;
