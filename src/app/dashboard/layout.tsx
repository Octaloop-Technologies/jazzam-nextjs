import { getCurrentLang } from "../action";
import { languages } from "@/lib/constants/languageConstants";
import OnboardingTour from "@/components/view/dashboard/leads/OnboardingTour";
import Navbar from "../super-user/Navbar";


const MainDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const lang = await getCurrentLang();

  return (
    <div className="min-h-dvh flex flex-col gap-6">
      <Navbar superUser={false} currentLang={lang} languages={languages} />
      <main className="x-padding flex-1">{children}</main>
      <OnboardingTour />
    </div>
  );
};

export default MainDashboardLayout;
