import { getCurrentLang } from "../action";
import Navbar from "./Navbar";
import { languages } from "@/lib/constants/languageConstants";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const lang = await getCurrentLang();

  return (
    <div className="min-h-dvh flex flex-col gap-6">
      <Navbar currentLang={lang} languages={languages} />
      <main className="x-padding flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
